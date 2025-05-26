
#[starknet::interface]
pub trait IActions<T> {
    fn spawn(ref self: T);
    fn give_heart(ref self: T, time: u64);
    //fn start_game_stats();
    //fn update_stats();
    //fn win();
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::IActions;
    use starknet::{ContractAddress, get_caller_address};
    use crate::models::{Capy, Gun, Game};

    use dojo::model::ModelStorage;
    use dojo::event::EventStorage;
    use starknet::get_block_timestamp;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Loved {
        #[key]
        pub player: ContractAddress,
        pub h: u8,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            let new_capy = Capy {
                player, 
                hearts: 4, 
                last_given_heart: get_block_timestamp()
            };

            world.write_model(@new_capy);

        }

        fn give_heart(ref self: ContractState, time: u64) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let mut capy: Capy = world.read_model(player);


            if time - capy.last_given_heart < 14400 && capy.hearts >= 4 {
                return;
            }

            capy.hearts += 1;
            
            world.write_model(@capy);

            world.emit_event(@Loved { player, h: capy.hearts });
    }

    }

    
    

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"capyspace")
        }
    }
}



