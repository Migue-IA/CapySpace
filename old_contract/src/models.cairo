use starknet::ContractAddress;
use core::traits::Into;  
use core::option::OptionTrait;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Capy {
    #[key]
    pub player: ContractAddress, // ContractAddress 
    pub hearts: u8,
    pub last_given_heart: u64, // timestamp
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Gun {
    #[key]
    pub player: ContractAddress, // ContractAddress + gun identifier
    pub gun_type: GunType,
    pub damage_level: u64,
    pub base_damage: u32,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player: ContractAddress, // ContractAddress 
    #[key]
    pub start_time: u64, // timestamp
    pub gun_type: GunType,
    pub gained: u64,
    pub kills: u64,
    pub level: u8,
}

#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum GunType {
    LaserGun,
    LaserShotgun,
    None,
}


impl GunTypeIntoFelt252 of Into<GunType, felt252> {
    fn into(self: GunType) -> felt252 {
        match self {
            GunType::LaserGun => 'LaserGun',
            GunType::LaserShotgun => 'LaserShotgun',
            GunType::None => 0, 
        }
    }
}

impl GunTypeIntou8 of Into<GunType, u8> {
    fn into(self: GunType) -> u8 {
        match self {
            GunType::LaserGun => 1_u8,
            GunType::LaserShotgun => 2_u8,
            GunType::None => 0_u8,
        }
    }
}


