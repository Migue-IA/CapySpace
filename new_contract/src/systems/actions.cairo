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
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use crate::models::{Capy, Game, Gun};
    use super::IActions;

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

            let new_capy = Capy { player, hearts: 2, last_given_heart: get_block_timestamp() };

            world.write_model(@new_capy);
        }

        fn give_heart(ref self: ContractState, time: u64) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let mut capy: Capy = world.read_model(player);

            if time - capy.last_given_heart > 14400 && capy.hearts >= 3 {
                return;
            }

            capy.hearts += 1;
            capy.last_given_heart = get_block_timestamp();

            world.write_model(@capy);

            world.emit_event(@Loved { player, h: capy.hearts });
        }
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

