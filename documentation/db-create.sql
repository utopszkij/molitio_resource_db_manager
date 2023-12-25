-- "public_user_schema".user_public definition

-- Drop table

-- DROP TABLE "public_user_schema".user_public;

CREATE TABLE "public_user_schema".user_public (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	username_public varchar(64) NOT NULL, -- publikus név (nick név)
	useravatar varchar(128) NULL, -- avatar kép url
	resource_collection_id uuid NULL, -- pointer a user erőforrás kollekciójára
	user_persisted_config_id uuid NULL, -- pointer a user konfigurációs beállításaira
	status varchar(32) NOT NULL DEFAULT 'enabled'::character varying,
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- létrehozás dátuma
	created_by uuid NULL, -- pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modosító user_public rekorjára
	CONSTRAINT newtableuser_public_pk PRIMARY KEY (id)
);
CREATE INDEX user_public_username_public_idx ON "public_user_schema".user_public USING btree (username_public);
COMMENT ON TABLE "public_user_schema".user_public IS 'user publikus adatai';

-- Column comments

COMMENT ON COLUMN "public_user_schema".user_public.id IS 'egyedi azonosító';
COMMENT ON COLUMN "public_user_schema".user_public.username_public IS 'publikus név (nick név)';
COMMENT ON COLUMN "public_user_schema".user_public.useravatar IS 'avatar kép url';
COMMENT ON COLUMN "public_user_schema".user_public.resource_collection_id IS 'pointer a user erőforrás kollekciójára';
COMMENT ON COLUMN "public_user_schema".user_public.user_persisted_config_id IS 'pointer a user konfigurációs beállításaira';
COMMENT ON COLUMN "public_user_schema".user_public.created_at IS 'létrehozás dátuma';
COMMENT ON COLUMN "public_user_schema".user_public.created_by IS 'pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)';
COMMENT ON COLUMN "public_user_schema".user_public.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "public_user_schema".user_public.updated_by IS 'pointer az utolsó modosító user_public rekorjára';


-- "private_user_schema".user_identity definition

-- Drop table

-- DROP TABLE "private_user_schema".user_identity;

CREATE TABLE "private_user_schema".user_identity (
	id uuid NOT NULL, -- egyedi azonosító pointer user_publik rekordra
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- létrehozás dátuma
	created_by uuid NULL, -- pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modosító user_public rekorjára
	"name" varchar NOT NULL, -- valódi név
	email varchar(80) NULL, -- e-mail cím
	id_public_key varchar NULL, -- ssh pulik key
	g_accout_id varchar NULL, -- google account id
	f_account_id varchar NULL, -- facebook account id
	phone varchar(80) NULL, -- telefon szám
	address_zip varchar(16) NULL, -- postai irányító szám
	address_country varchar(64) NULL, -- ország
	address_town varchar(80) NULL, -- település
	address_street_house_number varchar(128) NULL, -- utca, háznem stb
	CONSTRAINT user_identity_pk PRIMARY KEY (id),
	CONSTRAINT user_identity_fk FOREIGN KEY (id) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT user_identity_fk_1 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT user_identity_fk_2 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id)
);
CREATE INDEX user_identity_name_idx ON "private_user_schema".user_identity USING btree (name);
COMMENT ON TABLE "private_user_schema".user_identity IS 'user privát személyes adatai';

-- Column comments

COMMENT ON COLUMN "private_user_schema".user_identity.id IS 'egyedi azonosító pointer user_publik rekordra';
COMMENT ON COLUMN "private_user_schema".user_identity.created_at IS 'létrehozás dátuma';
COMMENT ON COLUMN "private_user_schema".user_identity.created_by IS 'pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)';
COMMENT ON COLUMN "private_user_schema".user_identity.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "private_user_schema".user_identity.updated_by IS 'pointer az utolsó modosító user_public rekorjára';
COMMENT ON COLUMN "private_user_schema".user_identity."name" IS 'valódi név';
COMMENT ON COLUMN "private_user_schema".user_identity.email IS 'e-mail cím';
COMMENT ON COLUMN "private_user_schema".user_identity.id_public_key IS 'ssh pulik key';
COMMENT ON COLUMN "private_user_schema".user_identity.g_accout_id IS 'google account id';
COMMENT ON COLUMN "private_user_schema".user_identity.f_account_id IS 'facebook account id';
COMMENT ON COLUMN "private_user_schema".user_identity.phone IS 'telefon szám';
COMMENT ON COLUMN "private_user_schema".user_identity.address_zip IS 'postai irányító szám';
COMMENT ON COLUMN "private_user_schema".user_identity.address_country IS 'ország';
COMMENT ON COLUMN "private_user_schema".user_identity.address_town IS 'település';
COMMENT ON COLUMN "private_user_schema".user_identity.address_street_house_number IS 'utca, háznem stb';


-- "public_user_schema".user_persisted_config definition

-- Drop table

-- DROP TABLE "public_user_schema".user_persisted_config;

CREATE TABLE "public_user_schema".user_persisted_config (
	id uuid NOT NULL, -- egyedi azonosító pointer az user_public táblára
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- létrehozás dátuma
	created_by uuid NULL, -- pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modosító user_public rekorjára
	"language" varchar(8) NOT NULL, -- humanlanguage pl: hu|en|de....
	selected_theme varchar(128) NULL, -- kiválasztott téma
	CONSTRAINT newtableuser_persisted_pk PRIMARY KEY (id),
	CONSTRAINT user_persisted_config_fk FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT user_persisted_config_fk_1 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT user_persisted_config_fk_2 FOREIGN KEY (id) REFERENCES "public_user_schema".user_public(id)
);
COMMENT ON TABLE "public_user_schema".user_persisted_config IS 'partner config beállításai';

-- Column comments

COMMENT ON COLUMN "public_user_schema".user_persisted_config.id IS 'egyedi azonosító pointer az user_public táblára';
COMMENT ON COLUMN "public_user_schema".user_persisted_config.created_at IS 'létrehozás dátuma';
COMMENT ON COLUMN "public_user_schema".user_persisted_config.created_by IS 'pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)';
COMMENT ON COLUMN "public_user_schema".user_persisted_config.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "public_user_schema".user_persisted_config.updated_by IS 'pointer az utolsó modosító user_public rekorjára';
COMMENT ON COLUMN "public_user_schema".user_persisted_config."language" IS 'humanlanguage pl: hu|en|de....';
COMMENT ON COLUMN "public_user_schema".user_persisted_config.selected_theme IS 'kiválasztott téma';


-- "resource_schema".resource_community definition

-- Drop table

-- DROP TABLE "resource_schema".resource_community;

CREATE TABLE "resource_schema".resource_community (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	"name" varchar(128) NOT NULL, -- csoport megnevezése
	description text NULL, -- csoport leírása
	status varchar(32) NOT NULL DEFAULT 'enabled'::character varying, -- enabled|draft|closed|archived|disabled....
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- rekord létrehozás dátuma
	created_by uuid NOT NULL, -- pointer a rekordot létrehozó user_public rekordjára
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modsító  user_pubic rekordjára
	CONSTRAINT resource_community_pk PRIMARY KEY (id),
	CONSTRAINT resource_community_fk FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT resource_community_fk_1 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id)
);
CREATE INDEX resource_community_name_idx ON "resource_schema".resource_community USING btree (name);
COMMENT ON TABLE "resource_schema".resource_community IS 'csoportok';

-- Column comments

COMMENT ON COLUMN "resource_schema".resource_community.id IS 'egyedi azonosító';
COMMENT ON COLUMN "resource_schema".resource_community."name" IS 'csoport megnevezése';
COMMENT ON COLUMN "resource_schema".resource_community.description IS 'csoport leírása';
COMMENT ON COLUMN "resource_schema".resource_community.status IS 'enabled|draft|closed|archived|disabled....';
COMMENT ON COLUMN "resource_schema".resource_community.created_at IS 'rekord létrehozás dátuma';
COMMENT ON COLUMN "resource_schema".resource_community.created_by IS 'pointer a rekordot létrehozó user_public rekordjára';
COMMENT ON COLUMN "resource_schema".resource_community.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "resource_schema".resource_community.updated_by IS 'pointer az utolsó modsító  user_pubic rekordjára';


-- "resource_schema".resource_label_type definition

-- Drop table

-- DROP TABLE "resource_schema".resource_label_type;

CREATE TABLE "resource_schema".resource_label_type (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- rekord létrehozás dátuma
	created_by uuid NOT NULL, -- pointer a rekordot létrehozó user_public rekordjára
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modsító  user_pubic rekordjára
	type_name varchar(238) NOT NULL, -- megnevezés
	unit varchar(64) NULL,
	CONSTRAINT resource_label_type_pk PRIMARY KEY (id),
	CONSTRAINT resource_label_type_fk FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT resource_label_type_fk_1 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id)
);
COMMENT ON TABLE "resource_schema".resource_label_type IS 'erőforrás készlet tulajdonságai';

-- Column comments

COMMENT ON COLUMN "resource_schema".resource_label_type.id IS 'egyedi azonosító';
COMMENT ON COLUMN "resource_schema".resource_label_type.created_at IS 'rekord létrehozás dátuma';
COMMENT ON COLUMN "resource_schema".resource_label_type.created_by IS 'pointer a rekordot létrehozó user_public rekordjára';
COMMENT ON COLUMN "resource_schema".resource_label_type.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "resource_schema".resource_label_type.updated_by IS 'pointer az utolsó modsító  user_pubic rekordjára';
COMMENT ON COLUMN "resource_schema".resource_label_type.type_name IS 'megnevezés';


-- "private_user_schema".private_resource_community definition

-- Drop table

-- DROP TABLE "private_user_schema".private_resource_community;

CREATE TABLE "private_user_schema".private_resource_community (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító pointer az user_public táblára
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- létrehozás dátuma
	created_by uuid NULL, -- pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modosító user_public rekorjára
	resource_community_id uuid NOT NULL, -- pointer resoure_communiti táblára
	"owner" uuid NOT NULL, -- pointer user_identity rekordra
	CONSTRAINT private_resource_community_pk PRIMARY KEY (id),
	CONSTRAINT private_resource_collection_fk FOREIGN KEY (id) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT private_resource_collection_fk_1 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT private_resource_collection_fk_4 FOREIGN KEY (resource_community_id) REFERENCES "resource_schema".resource_community(id),
	CONSTRAINT private_resource_community_fk_2 FOREIGN KEY ("owner") REFERENCES "public_user_schema".user_public(id)
);

-- Column comments

COMMENT ON COLUMN "private_user_schema".private_resource_community.id IS 'egyedi azonosító pointer az user_public táblára';
COMMENT ON COLUMN "private_user_schema".private_resource_community.created_at IS 'létrehozás dátuma';
COMMENT ON COLUMN "private_user_schema".private_resource_community.created_by IS 'pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)';
COMMENT ON COLUMN "private_user_schema".private_resource_community.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "private_user_schema".private_resource_community.updated_by IS 'pointer az utolsó modosító user_public rekorjára';
COMMENT ON COLUMN "private_user_schema".private_resource_community.resource_community_id IS 'pointer resoure_communiti táblára';
COMMENT ON COLUMN "private_user_schema".private_resource_community."owner" IS 'pointer user_identity rekordra';


-- "public_user_schema".public_resource_community definition

-- Drop table

-- DROP TABLE "public_user_schema".public_resource_community;

CREATE TABLE "public_user_schema".public_resource_community (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító pointer az user_public táblára
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- létrehozás dátuma
	created_by uuid NULL, -- pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modosító user_public rekorjára
	resource_community_id uuid NOT NULL, -- pointer resoure_communiti táblára
	"owner" uuid NOT NULL, -- pointer user_public táblára
	CONSTRAINT punlic_resource_community_pk PRIMARY KEY (id),
	CONSTRAINT public_resource_collection_fk FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT public_resource_collection_fk_1 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT public_resource_collection_fk_2 FOREIGN KEY ("owner") REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT public_resource_collection_fk_3 FOREIGN KEY (resource_community_id) REFERENCES "resource_schema".resource_community(id)
);
COMMENT ON TABLE "public_user_schema".public_resource_community IS 'partner - csoport tagságai';

-- Column comments

COMMENT ON COLUMN "public_user_schema".public_resource_community.id IS 'egyedi azonosító pointer az user_public táblára';
COMMENT ON COLUMN "public_user_schema".public_resource_community.created_at IS 'létrehozás dátuma';
COMMENT ON COLUMN "public_user_schema".public_resource_community.created_by IS 'pointer a létrehozó user_public rekordjára (ha nem sajátmaga hozta létre)';
COMMENT ON COLUMN "public_user_schema".public_resource_community.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "public_user_schema".public_resource_community.updated_by IS 'pointer az utolsó modosító user_public rekorjára';
COMMENT ON COLUMN "public_user_schema".public_resource_community.resource_community_id IS 'pointer resoure_communiti táblára';
COMMENT ON COLUMN "public_user_schema".public_resource_community."owner" IS 'pointer user_public táblára';


-- "resource_schema".resource_collection definition

-- Drop table

-- DROP TABLE "resource_schema".resource_collection;

CREATE TABLE "resource_schema".resource_collection (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	"name" varchar(128) NOT NULL, -- csoport megnevezése
	description text NULL, -- csoport leírása
	status varchar(32) NOT NULL DEFAULT 'enabled'::character varying, -- enabled|draft|closed|archived|disabled....
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- rekord létrehozás dátuma
	created_by uuid NOT NULL, -- pointer a rekordot létrehozó user_public rekordjára
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modsító  user_pubic rekordjára
	"owner" uuid NULL, -- fa struktúra pointer a tulajdonosára
	resource_community_id uuid NULL, -- poiinter resource_comminiti rekordra
	CONSTRAINT resource_collection_pk PRIMARY KEY (id),
	CONSTRAINT resource_collection_fk FOREIGN KEY (resource_communiry_id) REFERENCES "resource_schema".resource_community(id),
	CONSTRAINT resource_collection_fk_1 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT resource_collection_fk_2 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id)
);
COMMENT ON TABLE "resource_schema".resource_collection IS 'erőforrás készletek fa struktóra';

-- Column comments

COMMENT ON COLUMN "resource_schema".resource_collection.id IS 'egyedi azonosító';
COMMENT ON COLUMN "resource_schema".resource_collection."name" IS 'csoport megnevezése';
COMMENT ON COLUMN "resource_schema".resource_collection.description IS 'csoport leírása';
COMMENT ON COLUMN "resource_schema".resource_collection.status IS 'enabled|draft|closed|archived|disabled....';
COMMENT ON COLUMN "resource_schema".resource_collection.created_at IS 'rekord létrehozás dátuma';
COMMENT ON COLUMN "resource_schema".resource_collection.created_by IS 'pointer a rekordot létrehozó user_public rekordjára';
COMMENT ON COLUMN "resource_schema".resource_collection.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "resource_schema".resource_collection.updated_by IS 'pointer az utolsó modsító  user_pubic rekordjára';
COMMENT ON COLUMN "resource_schema".resource_collection."owner" IS 'fa struktúra pointer a tulajdonosára';
COMMENT ON COLUMN "resource_schema".resource_collection.resource_communiry_id IS 'poiinter resource_comminiti rekordra';


-- "resource_schema".resource_collection_label definition

-- Drop table

-- DROP TABLE "resource_schema".resource_collection_label;

CREATE TABLE "resource_schema".resource_collection_label (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- rekord létrehozás dátuma
	created_by uuid NOT NULL, -- pointer a rekordot létrehozó user_public rekordjára
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modsító  user_pubic rekordjára
	resource_collection_id uuid NOT NULL, -- poiinter resource_collection rekordra
	resource_label_type_id uuid NOT NULL, -- pointer resource_label_type rekordra
	value varchar NULL,
	CONSTRAINT resource_collection_label_pk PRIMARY KEY (id),
	CONSTRAINT resource_collection_label_fk FOREIGN KEY (resource_collection_id) REFERENCES "resource_schema".resource_collection(id),
	CONSTRAINT resource_collection_label_fk_1 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT resource_collection_label_fk_2 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT resource_collection_label_fk_3 FOREIGN KEY (resource_label_type_id) REFERENCES "resource_schema".resource_label_type(id)
);
COMMENT ON TABLE "resource_schema".resource_collection_label IS 'resource_collection tulajdonságai';

-- Column comments

COMMENT ON COLUMN "resource_schema".resource_collection_label.id IS 'egyedi azonosító';
COMMENT ON COLUMN "resource_schema".resource_collection_label.created_at IS 'rekord létrehozás dátuma';
COMMENT ON COLUMN "resource_schema".resource_collection_label.created_by IS 'pointer a rekordot létrehozó user_public rekordjára';
COMMENT ON COLUMN "resource_schema".resource_collection_label.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "resource_schema".resource_collection_label.updated_by IS 'pointer az utolsó modsító  user_pubic rekordjára';
COMMENT ON COLUMN "resource_schema".resource_collection_label.resource_collection_id IS 'poiinter resource_collection rekordra';
COMMENT ON COLUMN "resource_schema".resource_collection_label.resource_label_type_id IS 'pointer resource_label_type rekordra';


-- "resource_schema".resource definition

-- Drop table

-- DROP TABLE "resource_schema".resource;

CREATE TABLE "resource_schema".resource (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	"name" varchar(128) NOT NULL, -- csoport megnevezése
	description text NULL, -- csoport leírása
	status varchar(32) NOT NULL DEFAULT 'enabled'::character varying, -- enabled|draft|closed|archived|disabled....
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- rekord létrehozás dátuma
	created_by uuid NOT NULL, -- pointer a rekordot létrehozó user_public rekordjára
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modsító  user_pubic rekordjára
	resource_collection_id uuid NOT NULL, -- poiinter resource_collection rekordra
	CONSTRAINT resource__pk_1 PRIMARY KEY (id),
	CONSTRAINT resource_fk FOREIGN KEY (resource_collection_id) REFERENCES "resource_schema".resource_collection(id),
	CONSTRAINT resource_fk_1 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT resource_fk_2 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id)
);
CREATE INDEX resource_name_idx ON "resource_schema".resource USING btree (name);
COMMENT ON TABLE "resource_schema".resource IS 'erőforrások';

-- Column comments

COMMENT ON COLUMN "resource_schema".resource.id IS 'egyedi azonosító';
COMMENT ON COLUMN "resource_schema".resource."name" IS 'csoport megnevezése';
COMMENT ON COLUMN "resource_schema".resource.description IS 'csoport leírása';
COMMENT ON COLUMN "resource_schema".resource.status IS 'enabled|draft|closed|archived|disabled....';
COMMENT ON COLUMN "resource_schema".resource.created_at IS 'rekord létrehozás dátuma';
COMMENT ON COLUMN "resource_schema".resource.created_by IS 'pointer a rekordot létrehozó user_public rekordjára';
COMMENT ON COLUMN "resource_schema".resource.updated_at IS 'utolsó modosítás dátuma';
COMMENT ON COLUMN "resource_schema".resource.updated_by IS 'pointer az utolsó modsító  user_pubic rekordjára';
COMMENT ON COLUMN "resource_schema".resource.resource_collection_id IS 'poiinter resource_collection rekordra';


-- "resource_schema".resource_label definition

-- Drop table

-- DROP TABLE "resource_schema".resource_label;

CREATE TABLE "resource_schema".table_label (
	id uuid NOT NULL DEFAULT gen_random_uuid(), -- egyedi azonosító
	created_at date NOT NULL DEFAULT CURRENT_DATE, -- rekord létrehozás dátuma
	created_by uuid NOT NULL, -- pointer a rekordot létrehozó user_public rekordjára
	updated_at date NULL, -- utolsó modosítás dátuma
	updated_by uuid NULL, -- pointer az utolsó modsító  user_pubic rekordjára
	parent_table varchar(128) NOT NULL, -- tulajdonos tábla neve
	parent_id uuid NOT NULL, -- poiinter a tulajdonos rekordra
	resource_label_type_id uuid NOT NULL, -- pointer resource_label_type rekordra
	value varchar NULL,
	CONSTRAINT table_label_pk_1 PRIMARY KEY (id),
	CONSTRAINT table_label_fk_1 FOREIGN KEY (created_by) REFERENCES "public_user_schema".user_public(id),
	CONSTRAINT table_label_fk_2 FOREIGN KEY (updated_by) REFERENCES "public_user_schema".user_public(id)
	CONSTRAINT table_label_fk_3 FOREIGN KEY (resource_label_type_id) REFERENCES "resource_schema".resource_label_type(id)
);
COMMENT ON TABLE "resource_schema".table_label IS 'tábla tulajdonságok';

