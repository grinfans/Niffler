#[macro_use]
extern crate neon;
extern crate grin_config;
extern crate grin_core;
extern crate grin_wallet;
extern crate grin_util;
extern crate log;
extern crate serde_json;
extern crate grin_keychain;
extern crate uuid;

use neon::prelude::*;
use grin_config::GlobalConfig;
use grin_core::global;
use grin_core::global::ChainTypes;
use grin_keychain::ExtKeychain;
use grin_wallet::libwallet::api::{APIForeign, APIOwner};
use grin_wallet::libwallet::types::{NodeClient, WalletInst};
use uuid::Uuid;
use std::env;

use grin_wallet::{
    instantiate_wallet, FileWalletCommAdapter, HTTPNodeClient, LMDBBackend, WalletConfig,
    WalletSeed,
};

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::thread;
use grin_util::init_logger;
use grin_util::Mutex as GrinMutex;
use grin_util::file::get_first_line;

pub fn get_wallet_config(wallet_dir: &str) -> WalletConfig {
    let check_node_api_http_addr = env::var("check_node_api_http_addr").unwrap();
    let node_api_secret_path = env::var("node_api_secret_path").unwrap();

    WalletConfig {
        chain_type: Some(ChainTypes::Floonet),
        api_listen_interface: "127.0.0.1".to_string(),
        api_listen_port: 13415,
        api_secret_path: Some(".api_secret".to_string()),
        node_api_secret_path: Some(node_api_secret_path.to_owned() + "/.api_secret"),
        check_node_api_http_addr: check_node_api_http_addr.to_string(),
        data_file_dir: wallet_dir.to_owned() + "/wallet_data",
        tls_certificate_file: None,
        tls_certificate_key: None,
        dark_background_color_scheme: Some(true),
        keybase_notify_ttl: Some(1),
        no_commit_cache: None,
        owner_api_include_foreign: Some(true),
        owner_api_listen_port: Some(WalletConfig::default_owner_api_listen_port()),
    }
}

fn wallet_init(
    path: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet_config = get_wallet_config(path);
    let node_api_secret = get_first_line(wallet_config.node_api_secret_path.clone());

    let seed = WalletSeed::init_file(&wallet_config, 16, None, &password)?;
    let client_n = HTTPNodeClient::new(
        &wallet_config.check_node_api_http_addr,
        node_api_secret.clone(),
    );
    let _: LMDBBackend<HTTPNodeClient, ExtKeychain> =
        LMDBBackend::new(wallet_config.clone(), &password, client_n)?;
    seed.to_mnemonic()
}


fn query_tx_list(
    path: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let api = APIOwner::new(wallet.clone());
    match api.retrieve_txs(true, None, None) {
        Ok(txs) => Ok(serde_json::to_string(&txs).unwrap()),
        Err(e) => Err(grin_wallet::Error::from(e)),
    }
}

fn get_wallet_phrase(
    path: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet_config = get_wallet_config(path);
    let seed = WalletSeed::from_file(&wallet_config, &password)?;
    seed.to_mnemonic()
}

fn wallet_recovery(
    path: &str,
    phrase: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet_config = get_wallet_config(path);

    let node_api_secret = get_first_line(wallet_config.node_api_secret_path.clone());
    let _res = WalletSeed::recover_from_phrase(&wallet_config, &phrase, &password)?;
    let node_client = HTTPNodeClient::new(&wallet_config.check_node_api_http_addr, node_api_secret);
    let wallet = instantiate_wallet(wallet_config.clone(), node_client, password, "default")?;
    Ok("success".to_owned())
}


fn wallet_check(
    path: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIOwner::new(wallet.clone());

    match api.check_repair() {
        Ok(_) => Ok("success".to_owned()),
        Err(e) => Err(grin_wallet::Error::from(e)),
    }
}


fn get_wallet(
    path: &str,
    password: &str,
) -> Result<Arc<GrinMutex<WalletInst<impl NodeClient, ExtKeychain>>>, grin_wallet::Error> {
    let wallet_config = get_wallet_config(path);
    let node_api_secret = get_first_line(wallet_config.node_api_secret_path.clone());

    let node_client = HTTPNodeClient::new(&wallet_config.check_node_api_http_addr, node_api_secret);
    instantiate_wallet(wallet_config.clone(), node_client, password, "default")
}

fn balance(
    path: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIOwner::new(wallet.clone());
    let (_validated, wallet_info) = api.retrieve_summary_info(true, 1)?;
    Ok(serde_json::to_string(&wallet_info).unwrap())
}


fn create_transaction(
    path: &str,
    password: &str,
    message: &str,
    amount: u64,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIOwner::new(wallet.clone());
    let (slate, lock_fn) = api.initiate_tx(
        None,
        amount,
        1,
        1,
        false,
        Some(message.to_owned()),
    )?;
    api.tx_lock_outputs(&slate, lock_fn)?;
    Ok(serde_json::to_string(&slate).unwrap())
}

fn cancel_transaction(
    path: &str,
    password: &str,
    id: u32,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIOwner::new(wallet.clone());
    api.cancel_tx(Some(id), None)?;
    Ok("".to_owned())
}


fn receive_transaction(
    path: &str,
    password: &str,
    slate_path: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIForeign::new(wallet.clone());
    let adapter = FileWalletCommAdapter::new();
    let mut slate = adapter.receive_tx_async(&slate_path)?;
    api.verify_slate_messages(&slate)?;
    api.receive_tx(&mut slate, Some("default"), None)?;
    Ok(serde_json::to_string(&slate).unwrap())
}


fn query_transaction(
    path: &str,
    password: &str,
    tx_slate_id: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let api = APIOwner::new(wallet.clone());
    match Uuid::parse_str(tx_slate_id) {
        Ok(uuid) => {
            let txs = api.retrieve_txs(true, None, Some(uuid))?;
            Ok(serde_json::to_string(&txs).unwrap())
        }
        Err(e) => {
            Ok("error txid".to_owned())
        }
    }
}

fn query_outputs(
    path: &str,
    password: &str,
    id: u32,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let api = APIOwner::new(wallet.clone());
    let outputs = api.retrieve_outputs(true, true, Some(id))?;
    Ok(serde_json::to_string(&outputs).unwrap())
}

fn finalize_transaction(
    path: &str,
    password: &str,
    slate_path: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIOwner::new(wallet.clone());
    let adapter = FileWalletCommAdapter::new();
    let mut slate = adapter.receive_tx_async(&slate_path)?;
    api.verify_slate_messages(&slate)?;
    api.finalize_tx(&mut slate)?;
    api.post_tx(&slate.tx, true)?;
    Ok("".to_owned())
}

fn node_height(
    path: &str,
    password: &str,
) -> Result<String, grin_wallet::Error> {
    let wallet = get_wallet(path, password)?;
    let mut api = APIOwner::new(wallet.clone());
    let height = api.node_height()?;
    Ok(serde_json::to_string(&height).unwrap())
}


fn js_wallet_init(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();

    match wallet_init(&path, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_balance(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();

    match balance(&path, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_wallet_recovery(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let phrase = cx.argument::<JsString>(1)?.value();
    let password = cx.argument::<JsString>(2)?.value();

    match wallet_recovery(&path, &phrase, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_get_wallet_phrase(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    match get_wallet_phrase(&path, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string("wrongPassword"))
        }
    }
}

fn js_query_tx_list(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();

    match query_tx_list(&path, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_cancel_transaction(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    let id = cx.argument::<JsNumber>(2)?.value() as u32;

    match cancel_transaction(&path, &password, id) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_finalize_transaction(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    let slate_path = cx.argument::<JsString>(2)?.value();
    match finalize_transaction(&path, &password, &slate_path) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_receive_transaction(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    let slate_path = cx.argument::<JsString>(2)?.value();
    match receive_transaction(&path, &password, &slate_path) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_query_transaction(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    let tx_slate_id = cx.argument::<JsString>(2)?.value();

    match query_transaction(&path, &password, &tx_slate_id) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_query_outputs(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    let id = cx.argument::<JsNumber>(2)?.value() as u32;

    match query_outputs(&path, &password, id) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_create_transaction(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();
    let message = cx.argument::<JsString>(2)?.value();
    let amount = cx.argument::<JsNumber>(3)?.value();

    match create_transaction(&path, &password, &message, amount as u64) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

fn js_node_height(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();

    match node_height(&path, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}



fn js_wallet_check(mut cx: FunctionContext) -> JsResult<JsString> {
    let path = cx.argument::<JsString>(0)?.value();
    let password = cx.argument::<JsString>(1)?.value();

    match wallet_check(&path, &password) {
        Ok(res) => {
            Ok(cx.string(res))
        }
        Err(e) => {
            Ok(cx.string(serde_json::to_string(&format!("{}",e)).unwrap()))
        }
    }
}

register_module!(mut cx, {
    cx.export_function("wallet_init", js_wallet_init);
    cx.export_function("wallet_recovery", js_wallet_recovery);
    cx.export_function("balance", js_balance);
    cx.export_function("query_tx_list", js_query_tx_list);
    cx.export_function("query_transaction", js_query_transaction);
    cx.export_function("query_outputs", js_query_outputs);
    cx.export_function("receive_transaction", js_receive_transaction);
    cx.export_function("create_transaction", js_create_transaction);
    cx.export_function("finalize_transaction", js_finalize_transaction);
    cx.export_function("cancel_transaction", js_cancel_transaction);
    cx.export_function("get_wallet_phrase", js_get_wallet_phrase);
    cx.export_function("node_height", js_node_height);
    cx.export_function("wallet_check", js_wallet_check);
    Ok(())
});
