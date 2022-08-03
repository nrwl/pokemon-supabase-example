CREATE TABLE IF NOT EXISTS public.pokemon
(
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    CONSTRAINT pokemon_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.moves
(
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    CONSTRAINT move_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.learnable_moves
(
    pokemonId text NOT NULL,
    moveId text NOT NULL,
    CONSTRAINT learnable_moves_pkey PRIMARY KEY (pokemonId, moveId),
    CONSTRAINT learnable_moves_pokemonId_fkey FOREIGN KEY (pokemonId)
        REFERENCES public.pokemon (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT learnable_moves_moveId_fkey FOREIGN KEY (moveId)
        REFERENCES public.moves (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)

TABLESPACE pg_default;