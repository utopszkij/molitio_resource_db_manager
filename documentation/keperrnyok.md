## MOLITIO Resource manager

MOLITIO resource adatbázis tartalom meneger GUI adminisztrátorok számára

## Authorization

A végleges változatban login/regist/profile...stb authoziciós rendszer és jogosultság ellenörzésnek kell lenni.
Ideiglenes teszt változatban a HASURA DATA felületen létre kell hozni egy admin rekordot (user_public táblába)
és a user reducer init ezt állítja be bejelentkezett usernek.

## Homepage

Álltalénos ismertetés, főmenü:
 
- Resource_community browser
- Resorce_collection browser
- Resources browser
- Resource_label_typesbrowser
- Bejelentkezés/Regisztrálás | Kijelentkezés

## Resource_community browser

- Főmenü
- Böngésző képernyő, szűréssel, kereséssel, rendezéssel, lapozással.
- Almenü: resource_label_types browser, új resource_community felvitele, vissza a kezdőlapra

### szűrési lehetőségek

- name
- description részlet
- status
- label type és value
- tag user username_public
- created_by username_public
- created_at tól -ig

### böngésző tábla oszlopai

- name
- description eleje
- status
- created_by username_public és avatar kép
- created_at

### rendezési lehetőség 

a fenti oszlopok bármyelyikére 


### az egyes sorokkal végezheő akciók

- show
- edit
- remove
- hozzá tartozó resource_collections browser
- hozzá tartozó resource_label browser

## Resource_collection browser

- Főmenü
- Böngésző képernyő, szűréssel, kereséssel, rendezéssel, lapozással.
- Almenü: resource_label_types browser, új resource_collection felvitele, vissza a resource_community browserre, vissza a kezdőlapra

### szűrési lehetőségek

- name
- description részlet
- status
- label type és value
- created_at tól -ig
- created_by username_public

### böngésző tábla oszlopai

- name
- description eleje
- status
- created_by username_public és avatar kép
- created_at

### rendezési lehetőség 

a fenti oszlopok bármyelyikére 


### az egyes sorokkal végezheő akciók

- show
- edit
- remove
- hozzá tartozó resource_collection browser
- hozzá tartozó resource_label browser

## Resource browser

- Főmenü
- Böngésző képernyő, szűréssel, kereséssel, rendezéssel, lapozással.
- Almenü: resource_label_types browser, új resource felvitele, vissza a resource_collection browserre, vissza resorce_community browserre, vissza a kezdőlapra

### szűrési lehetőségek

- name
- description részlet
- status
- label type és value
- created_at tól -ig
- created_by username_public

### böngésző tábla oszlopai

- name
- description eleje
- status
- created_by username_public és avatar kép
- created_at

### rendezési lehetőség 

a fenti oszlopok bármyelyikére 


### az egyes sorokkal végezheő akciók

- show
- edit
- remove
- hozzá tartozó resource_label browser

## Label browser

- Főmenü
- Böngésző képernyő, szűréssel, kereséssel, rendezéssel, lapozással.
- Almenü: új label felvitele, vissza a tulajdonosához, vissza a kezdőlapra

### szűrési lehetőségek

- type
- value részlet
- created_at tól -ig
- created_by username_public

### böngésző tábla oszlopai

- typee
- value eleje
- created_by username_public és avatar kép
- created_at

### rendezési lehetőség 

a fenti oszlopok bármyelyikére 


### az egyes sorokkal végezheő akciók

- show
- edit
- remove

## show képernyők (rekord tipusonként egy-egy)

- Főmenü
- a kiválasztott rekord teljes adattartalmának megjelenítése, a
pointerknél a kapcsolt rekord beolvasása és annak a név adata jelenik meg.

user akciók:

- edit
- remove 
- vissza a böngésző képernyőre
- vissza a kezdő lapra
- open childs (az adott táblának megelelő alrekordok böngészése)
- labels browser

## edit képernyők (rekord tipusonként egy-egy)

- Főmenü
- a rekord editálható adatformja

user akciók:

- save
- cancel --> vissza a böngészőre
- vissza a kezdő lapra

## remove (rekord tipusonként egy-egy)

- Főmenü
- Biztos vagy benne kérdés? a rekord fő adatainak megjelenítésével

user akciók  
  
- yes   --> törlés végrehajtása és vissza a böngészőbe
- no    --> vissza a böngészőbe
- vissza kezdőlapra








