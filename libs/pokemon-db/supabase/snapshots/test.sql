--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: moves; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.moves VALUES ('MOVE_FLAME_THROWER', 'Flamethrower', '🔥', 'Cool Fire stuff');
INSERT INTO public.moves VALUES ('MOVE_THUNDER_BOLT', 'Thunder Bolt', 'Lectric', 'Boom boom boom.');
INSERT INTO public.moves VALUES ('MOVE_BE_LAME', 'Be Lame', 'Pathetic', 'Be Pathetic.');


--
-- Data for Name: pokemon; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pokemon VALUES ('025', 'Pikachu', 'Lectric');
INSERT INTO public.pokemon VALUES ('004', 'Charmander', '🔥');
INSERT INTO public.pokemon VALUES ('007', 'Squirtly', 'Pathetic');


--
-- Data for Name: learnable_moves; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.learnable_moves VALUES ('025', 'MOVE_THUNDER_BOLT');
INSERT INTO public.learnable_moves VALUES ('004', 'MOVE_FLAME_THROWER');
INSERT INTO public.learnable_moves VALUES ('007', 'MOVE_BE_LAME');


--
-- PostgreSQL database dump complete
--

