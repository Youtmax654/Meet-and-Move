create table if not exists interests
(
    id   uuid default gen_random_uuid() not null
        primary key,
    name varchar
);

create table if not exists "user"
(
    id                uuid      default gen_random_uuid() not null
        primary key,
    name              text                                not null,
    email             text                                not null
        constraint user_email_unique
            unique,
    email_verified    boolean   default false             not null,
    phone_number      text
        constraint user_phone_number_unique
            unique,
    phone_verified    boolean   default false             not null,
    age               integer,
    gender            varchar,
    image             text,
    bio               text,
    meetcoins_balance integer   default 0                 not null,
    created_at        timestamp default now()             not null,
    updated_at        timestamp default now()             not null
);

create table if not exists account
(
    id                       uuid      default gen_random_uuid() not null
        primary key,
    account_id               uuid                                not null,
    provider_id              uuid                                not null,
    user_id                  uuid                                not null
        constraint account_user_id_user_id_fk
            references "user"
            on delete cascade,
    access_token             text,
    refresh_token            text,
    id_token                 text,
    access_token_expires_at  timestamp,
    refresh_token_expires_at timestamp,
    scope                    text,
    password                 text,
    created_at               timestamp default now()             not null,
    updated_at               timestamp default now()             not null
);

create index if not exists "account_userId_idx"
    on account (user_id);

create table if not exists activities
(
    id               uuid      default gen_random_uuid() not null
        primary key,
    host_id          uuid                                not null
        constraint activities_host_id_user_id_fk
            references "user"
            on delete cascade,
    title            varchar                             not null,
    description      text,
    category_id      uuid
        constraint activities_category_id_interests_id_fk
            references interests
            on delete set null,
    specific_details jsonb,
    latitude         numeric,
    longitude        numeric,
    max_participants integer,
    min_age          integer,
    max_age          integer,
    auto_validate    boolean   default true,
    event_date       timestamp,
    created_at       timestamp default now()
);

create table if not exists activity_participants
(
    activity_id uuid not null
        constraint activity_participants_activity_id_activities_id_fk
            references activities
            on delete cascade,
    user_id     uuid not null
        constraint activity_participants_user_id_user_id_fk
            references "user"
            on delete cascade,
    status      varchar   default 'pending'::character varying,
    joined_at   timestamp default now(),
    constraint activity_participants_activity_id_user_id_pk
        primary key (activity_id, user_id)
);

create table if not exists chats
(
    id          uuid      default gen_random_uuid() not null
        primary key,
    activity_id uuid
        constraint chats_activity_id_activities_id_fk
            references activities
            on delete cascade,
    type        varchar,
    created_at  timestamp default now()
);

create table if not exists chat_members
(
    chat_id   uuid not null
        constraint chat_members_chat_id_chats_id_fk
            references chats
            on delete cascade,
    user_id   uuid not null
        constraint chat_members_user_id_user_id_fk
            references "user"
            on delete cascade,
    joined_at timestamp default now(),
    constraint chat_members_chat_id_user_id_pk
        primary key (chat_id, user_id)
);

create table if not exists messages
(
    id        uuid      default gen_random_uuid() not null
        primary key,
    chat_id   uuid                                not null
        constraint messages_chat_id_chats_id_fk
            references chats
            on delete cascade,
    sender_id uuid                                not null
        constraint messages_sender_id_user_id_fk
            references "user"
            on delete cascade,
    content   text,
    sent_at   timestamp default now()
);

create table if not exists session
(
    id         uuid      default gen_random_uuid() not null
        primary key,
    expires_at timestamp                           not null,
    token      text                                not null
        constraint session_token_unique
            unique,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null,
    ip_address text,
    user_agent text,
    user_id    uuid                                not null
        constraint session_user_id_user_id_fk
            references "user"
            on delete cascade
);

create index if not exists "session_userId_idx"
    on session (user_id);

create table if not exists transactions
(
    id                  uuid      default gen_random_uuid() not null
        primary key,
    user_id             uuid                                not null
        constraint transactions_user_id_user_id_fk
            references "user"
            on delete cascade,
    amount              integer                             not null,
    transaction_type    varchar,
    related_activity_id uuid
        constraint transactions_related_activity_id_activities_id_fk
            references activities
            on delete set null,
    created_at          timestamp default now()
);

create table if not exists user_favorite_activities
(
    user_id     uuid not null
        constraint user_favorite_activities_user_id_user_id_fk
            references "user"
            on delete cascade,
    activity_id uuid not null
        constraint user_favorite_activities_activity_id_activities_id_fk
            references activities
            on delete cascade,
    created_at  timestamp default now(),
    constraint user_favorite_activities_user_id_activity_id_pk
        primary key (user_id, activity_id)
);

create table if not exists user_interests
(
    user_id     uuid not null
        constraint user_interests_user_id_user_id_fk
            references "user"
            on delete cascade,
    interest_id uuid not null
        constraint user_interests_interest_id_interests_id_fk
            references interests
            on delete cascade,
    constraint user_interests_user_id_interest_id_pk
        primary key (user_id, interest_id)
);

create table if not exists verification
(
    id         uuid      default gen_random_uuid() not null
        primary key,
    identifier text                                not null,
    value      text                                not null,
    expires_at timestamp                           not null,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null
);

create index if not exists verification_identifier_idx
    on verification (identifier);

