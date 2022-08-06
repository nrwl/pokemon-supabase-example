CREATE TABLE IF NOT EXISTS public.pokemon
(
    id text NOT NULL,
    name text NOT NULL,
    type_1 text NOT NULL,
    type_2 text,
    classification text NOT NULL,
    height number NOT NULL,
    weight number NOT NULL,
    capture_rate number NOT NULL,
    image_url text NOT NULL,
    base_stat_hp number NOT NULL,
    base_stat_attack number NOT NULL,
    base_stat_defense number NOT NULL,
    base_stat_special number NOT NULL,
    base_stat_speed number NOT NULL,
    lv_50_min_hp number NOT NULL,
    lv_50_max_hp number NOT NULL,
    lv_50_min_attack number NOT NULL,
    lv_50_max_attack number NOT NULL,
    lv_50_min_defense number NOT NULL,
    lv_50_max_defense number NOT NULL,
    lv_50_min_special number NOT NULL,
    lv_50_max_special number NOT NULL,
    lv_50_min_speed number NOT NULL,
    lv_50_max_speed number NOT NULL,
    lv_100_min_hp number NOT NULL,
    lv_100_max_hp number NOT NULL,
    lv_100_min_attack number NOT NULL,
    lv_100_max_attack number NOT NULL,
    lv_100_min_defense number NOT NULL,
    lv_100_max_defense number NOT NULL,
    lv_100_min_special number NOT NULL,
    lv_100_max_special number NOT NULL,
    lv_100_min_speed number NOT NULL,
    lv_100_max_speed number NOT NULL,
    CONSTRAINT pokemon_pkey PRIMARY KEY (id)
    CONSTRAINT pokemon_type_1_fkey FOREIGN KEY (type_1)
        REFERENCES public.types (name) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT pokemon_type_2_fkey FOREIGN KEY (type_2)
        REFERENCES public.types (name) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.moves
(
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    attack number,
    accuracy number,
    power_points number,
    effect_percentage number,
    CONSTRAINT move_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.types
(
    name text NOT NULL,
    CONSTRAINT type_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.moves_learned_by_level
(
    pokemon_Id text NOT NULL,
    move_id text NOT NULL,
    level number,
    CONSTRAINT moved_learned_by_level_pkey PRIMARY KEY (pokemon_id, move_id),
    CONSTRAINT moves_learned_by_level_pokemon_id_fkey FOREIGN KEY (pokemon_id)
        REFERENCES public.pokemon (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT moves_learned_by_level_move_id_fkey FOREIGN KEY (move_id)
        REFERENCES public.moves (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.moves_learned_by_item {
    pokemon_id text NOT NULL,
    move_id text NOT NULL,
    item_name text NOT NULL,
    CONSTRAINT moves_learned_by_item_pkey PRIMARY KEY (pokemon_id, move_id),
    CONSTRAINT moves_learned_by_item_pokemon_id_fkey FOREIGN KEY (pokemon_id)
        REFERENCES public.pokemon (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT moves_learned_by_item_move_id_fkey FOREIGN KEY (move_id)
        REFERENCES public.moves (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
}

TABLESPACE pg_default;