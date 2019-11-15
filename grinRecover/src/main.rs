use std::env;
use grin_wallet_impls::{
    instantiate_wallet, Error, HTTPNodeClient, WalletSeed,
};
use grin_wallet_config::{WalletConfig};
use grin_wallet_util::grin_core::global::ChainTypes;

fn get_wallet_config(
    wallet_dir: &str, 
    check_node_api_http_addr: &str, 
    //node_api_secret_path: &str
) -> WalletConfig {
    WalletConfig {
        chain_type: Some(ChainTypes::Mainnet),
        api_listen_interface: "127.0.0.1".to_string(),
        api_listen_port: 3415,
        api_secret_path: None,
        node_api_secret_path: None,
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

fn wallet_recovery(
    path: &str,
    phrase: &str,
    password: &str,
) -> Result<String, Error> {
    let wallet_config = get_wallet_config(path, "http://127.0.0.1:3414");
    let _res = WalletSeed::recover_from_phrase(&wallet_config, &phrase, &password)?;
    let node_client = HTTPNodeClient::new(&wallet_config.check_node_api_http_addr, None);
    let wallet = instantiate_wallet(wallet_config.clone(), node_client, password, "default")?;
    Ok("success".to_owned())
}


fn main() {
    let args: Vec<String> = env::args().collect();
    let path = &args[1];
    let word = &args[2];
    let password = &args[3];
    wallet_recovery(path, word, password);
}
