CREATE TABLE IF NOT EXISTS public.types
(
    name text NOT NULL,
    CONSTRAINT type_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.pokemon
(
    id text NOT NULL,
    name text NOT NULL,
    type1 text NOT NULL,
    type2 text,
    classification text NOT NULL,
    height decimal NOT NULL,
    weight decimal NOT NULL,
    capture_rate decimal,
    image_url text NOT NULL,
    base_stat_hp integer NOT NULL,
    base_stat_attack integer NOT NULL,
    base_stat_defense integer NOT NULL,
    base_stat_special integer NOT NULL,
    base_stat_speed integer NOT NULL,
    level_50_min_hp integer NOT NULL,
    level_50_max_hp integer NOT NULL,
    level_50_min_attack integer NOT NULL,
    level_50_max_attack integer NOT NULL,
    level_50_min_defense integer NOT NULL,
    level_50_max_defense integer NOT NULL,
    level_50_min_special integer NOT NULL,
    level_50_max_special integer NOT NULL,
    level_50_min_speed integer NOT NULL,
    level_50_max_speed integer NOT NULL,
    level_100_min_hp integer NOT NULL,
    level_100_max_hp integer NOT NULL,
    level_100_min_attack integer NOT NULL,
    level_100_max_attack integer NOT NULL,
    level_100_min_defense integer NOT NULL,
    level_100_max_defense integer NOT NULL,
    level_100_min_special integer NOT NULL,
    level_100_max_special integer NOT NULL,
    level_100_min_speed integer NOT NULL,
    level_100_max_speed integer NOT NULL,
    CONSTRAINT pokemon_pkey PRIMARY KEY (id),
    CONSTRAINT pokemon_type1_fkey FOREIGN KEY (type1)
        REFERENCES public.types (name) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT pokemon_type2_fkey FOREIGN KEY (type2)
        REFERENCES public.types (name) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.moves
(
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    attack decimal,
    accuracy decimal,
    power_points integer,
    effect_percentage decimal,
    CONSTRAINT move_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.moves_learned_by_level
(
    pokemon_id text NOT NULL,
    move_id text NOT NULL,
    level integer,
    CONSTRAINT moves_learned_by_level_pkey PRIMARY KEY (pokemon_id, move_id),
    CONSTRAINT moves_learned_by_level_pokemon_id_fkey FOREIGN KEY (pokemon_id)
        REFERENCES public.pokemon (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT moves_learned_by_level_move_id_fkey FOREIGN KEY (move_id)
        REFERENCES public.moves (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.moves_learned_by_item
(
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
)

TABLESPACE pg_default;