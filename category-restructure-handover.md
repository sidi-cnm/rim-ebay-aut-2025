## Page 1

EDDEYAR
Migration handover document

# Eddeyar database restructure
Frontend developer handover document

This document explains a major restructure of the Eddeyar category system. The data layer (MongoDB Atlas + Turso SQLite) has been migrated. The frontend code now needs to be updated to match the new structure.

<table>
  <thead>
    <tr>
      <th>Item</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Turso options table</td>
      <td>Migrated to new tree</td>
    </tr>
    <tr>
      <td>MongoDB annonces collection</td>
      <td>All 95 documents updated</td>
    </tr>
    <tr>
      <td>Backend code</td>
      <td>Pending update</td>
    </tr>
    <tr>
      <td>Frontend filters</td>
      <td>Pending update — addressed in this document</td>
    </tr>
    <tr>
      <td>Architecture documentation</td>
      <td>Refreshed</td>
    </tr>
  </tbody>
</table>

**Migration completed without data loss**

All 95 announces preserved their content. Only the category/type IDs and the associated denormalized name fields were updated. The classification breadcrumb (classificationFr / classificationAr) was regenerated automatically.

Database restructure — May 2026
&lt;page_number&gt;Page 1&lt;/page_number&gt;

---


## Page 2

EDDEYAR
Migration handover document

# 1. Why this change was needed

## The problem

On the Eddeyar website, when a user clicked the **Immobilier** filter, the URL became `?categorieId=6`, which only matched real estate announces of type **Vente** (for sale). When the user then added a **Location** filter, the URL became `?categorieId=6&typeAnnonceId=2`, which returned **zero results** — because `categorieId=6` only existed under `typeAnnonceId=1` (Vente), never under Location.

## Root cause

The category tree was structured **type-first** — Vente and Location were top-level types, with separate copies of "Maisons", "Voitures", etc. nested inside each. This duplication meant the same real-world category had two different IDs depending on whether it was for sale or for rent.

## The fix

We restructured the tree to be **category-first** — the top-level types now represent *kinds of objects* (Maison, Voiture, Electronique, Service, Demande, Autre), and Vente/Location now sit one level below as sub-choices. This matches how users actually think ("I want a house, then I'll decide buy vs rent") and eliminates the ambiguity.

# 2. The new category tree

## Level 1 — typeAnnonce (top-level filter buttons)

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>NAME (FR)</th>
      <th>NAMEAR</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Maison</td>
      <td>عقارات</td>
      <td>Real estate (houses, apartments, land)</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Voiture</td>
      <td>سيارات</td>
      <td>Vehicles (cars, trucks, tankers)</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Electronique</td>
      <td>إلكترونيات</td>
      <td>Phones, laptops, electronics</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Service</td>
      <td>خدمات</td>
      <td>Services (cleaning, repair, teaching, water)</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Demande</td>
      <td>طلب</td>
      <td>Buy requests (no children)</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Autre</td>
      <td>أخرى</td>
      <td>Anything that doesn't fit (no children)</td>
    </tr>
  </tbody>
</table>

*Note: Demande and Autre are leaves — they have no children. When a user picks Demande they see the demande list directly.*

## Level 2 — categorie (transaction or service type)

Database restructure — May 2026
&lt;page_number&gt;Page 2&lt;/page_number&gt;

---


## Page 3

EDDEYAR
Migration handover document

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>NAME (FR)</th>
      <th>Parent</th>
      <th>Children IDs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>7</td>
      <td>Vente</td>
      <td>Maison (1)</td>
      <td>17–20</td>
    </tr>
    <tr>
      <td>8</td>
      <td>Location</td>
      <td>Maison (1)</td>
      <td>21–26</td>
    </tr>
    <tr>
      <td>9</td>
      <td>Vente</td>
      <td>Voiture (2)</td>
      <td>27–30</td>
    </tr>
    <tr>
      <td>10</td>
      <td>Location</td>
      <td>Voiture (2)</td>
      <td>31–33</td>
    </tr>
    <tr>
      <td>11</td>
      <td>Vente</td>
      <td>Electronique (3)</td>
      <td>34–36</td>
    </tr>
    <tr>
      <td>12</td>
      <td>Service de réparation</td>
      <td>Service (4)</td>
      <td>37–38</td>
    </tr>
    <tr>
      <td>13</td>
      <td>Service de nettoyage</td>
      <td>Service (4)</td>
      <td>(none)</td>
    </tr>
    <tr>
      <td>14</td>
      <td>Service d'enseignement</td>
      <td>Service (4)</td>
      <td>(none)</td>
    </tr>
    <tr>
      <td>15</td>
      <td>Distribution d'eau</td>
      <td>Service (4)</td>
      <td>(none)</td>
    </tr>
    <tr>
      <td>16</td>
      <td>Autres services</td>
      <td>Service (4)</td>
      <td>(none)</td>
    </tr>
  </tbody>
</table>

Note: Electronique only has Vente — there is no Location for electronics (no announces ever needed it).

Database restructure — May 2026
&lt;page_number&gt;Page 3&lt;/page_number&gt;

---


## Page 4

EDDEYAR
Migration handover document

# Level 3 — souscategorie (specific item)

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>NAME (FR)</th>
      <th>Parent path</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>17</td>
      <td>Appart(s)</td>
      <td>Maison > Vente</td>
    </tr>
    <tr>
      <td>18</td>
      <td>Maison(s)</td>
      <td>Maison > Vente</td>
    </tr>
    <tr>
      <td>19</td>
      <td>Terrain(s)</td>
      <td>Maison > Vente</td>
    </tr>
    <tr>
      <td>20</td>
      <td>Autre</td>
      <td>Maison > Vente</td>
    </tr>
    <tr>
      <td>21</td>
      <td>Maison</td>
      <td>Maison > Location</td>
    </tr>
    <tr>
      <td>22</td>
      <td>Maison meublée</td>
      <td>Maison > Location</td>
    </tr>
    <tr>
      <td>23</td>
      <td>Appartement</td>
      <td>Maison > Location</td>
    </tr>
    <tr>
      <td>24</td>
      <td>Appartement meublée</td>
      <td>Maison > Location</td>
    </tr>
    <tr>
      <td>25</td>
      <td>Magasin</td>
      <td>Maison > Location</td>
    </tr>
    <tr>
      <td>26</td>
      <td>Boutique</td>
      <td>Maison > Location</td>
    </tr>
    <tr>
      <td>27</td>
      <td>Voiture</td>
      <td>Voiture > Vente</td>
    </tr>
    <tr>
      <td>28</td>
      <td>Camion</td>
      <td>Voiture > Vente</td>
    </tr>
    <tr>
      <td>29</td>
      <td>Citerne</td>
      <td>Voiture > Vente</td>
    </tr>
    <tr>
      <td>30</td>
      <td>Autres</td>
      <td>Voiture > Vente</td>
    </tr>
    <tr>
      <td>31</td>
      <td>Voiture</td>
      <td>Voiture > Location</td>
    </tr>
    <tr>
      <td>32</td>
      <td>Engins, camion</td>
      <td>Voiture > Location</td>
    </tr>
    <tr>
      <td>33</td>
      <td>Autres</td>
      <td>Voiture > Location</td>
    </tr>
    <tr>
      <td>34</td>
      <td>Téléphone</td>
      <td>Electronique > Vente</td>
    </tr>
    <tr>
      <td>35</td>
      <td>Ordinateur portable</td>
      <td>Electronique > Vente</td>
    </tr>
    <tr>
      <td>36</td>
      <td>Autres</td>
      <td>Electronique > Vente</td>
    </tr>
    <tr>
      <td>37</td>
      <td>Réparation électrique</td>
      <td>Service > Réparation</td>
    </tr>
    <tr>
      <td>38</td>
      <td>Réparation plomberie</td>
      <td>Service > Réparation</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 4&lt;/page_number&gt;

---


## Page 5

EDDEYAR
Migration handover document

# 3. Visual representation

## Complete navigation paths

```
Maison (id=1)
|-- Vente (id=7)
|   |-- Appart(s) (id=17)
|   |-- Maison(s) (id=18)
|   |-- Terrain(s) (id=19)
|   +-- Autre (id=20)
+-- Location (id=8)
    |-- Maison (id=21)
    |-- Maison meublee (id=22)
    |-- Appartement (id=23)
    |-- Appartement meublee (id=24)
    |-- Magasin (id=25)
    +-- Boutique (id=26)

Voiture (id=2)
|-- Vente (id=9)
|   |-- Voiture (id=27)
|   |-- Camion (id=28)
|   |-- Citerne (id=29)
|   +-- Autres (id=30)
+-- Location (id=10)
    |-- Voiture (id=31)
    |-- Engins, camion (id=32)
    +-- Autres (id=33)

Electronique (id=3)
+-- Vente (id=11)
    |-- Telephone (id=34)
    |-- Ordinateur portable (id=35)
    +-- Autres (id=36)

Service (id=4)
|-- Service de reparation (id=12)
|   |-- Reparation electrique (id=37)
|   +-- Reparation plomberie (id=38)
|-- Service de nettoyage (id=13)
|-- Service d'enseignement (id=14)
|-- Distribution d'eau (id=15)
+-- Autres services (id=16)

Demande (id=5) (leaf - no children)
Autre (id=6) (leaf - no children)
```

Database restructure — May 2026
&lt;page_number&gt;Page 5&lt;/page_number&gt;

---


## Page 6

EDDEYAR
Migration handover document

# 4. URL filter changes (the most important section)

The frontend filter buttons currently use **old IDs** in the URL. These need to be updated to the new IDs. Here is the complete mapping:

## Top-level filter buttons

<table>
  <thead>
    <tr>
      <th>Filter button</th>
      <th>OLD URL</th>
      <th>NEW URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maison / Immobilier</td>
      <td>?categorield=6</td>
      <td>?typeAnnonceld=1</td>
    </tr>
    <tr>
      <td>Voiture</td>
      <td>?categorield=7</td>
      <td>?typeAnnonceld=2</td>
    </tr>
    <tr>
      <td>Electronique</td>
      <td>?categorield=5</td>
      <td>?typeAnnonceld=3</td>
    </tr>
    <tr>
      <td>Service</td>
      <td>?typeAnnonceld=3</td>
      <td>?typeAnnonceld=4</td>
    </tr>
    <tr>
      <td>Demande</td>
      <td>?typeAnnonceld=39</td>
      <td>?typeAnnonceld=5</td>
    </tr>
    <tr>
      <td>Autre</td>
      <td>?categorield=8</td>
      <td>?typeAnnonceld=6</td>
    </tr>
  </tbody>
</table>

## Combined filter examples (Maison + Vente/Location)

<table>
  <thead>
    <tr>
      <th>User intent</th>
      <th>OLD URL (broken)</th>
      <th>NEW URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maisons à vendre</td>
      <td>?categorield=6&typeAnnonceld=1</td>
      <td>?typeAnnonceld=1&categorield=7</td>
    </tr>
    <tr>
      <td>Maisons à louer</td>
      <td>?categorield=6&typeAnnonceld=2</td>
      <td>?typeAnnonceld=1&categorield=8</td>
    </tr>
    <tr>
      <td>Voitures à vendre</td>
      <td>?categorield=7&typeAnnonceld=1</td>
      <td>?typeAnnonceld=2&categorield=9</td>
    </tr>
    <tr>
      <td>Voitures à louer</td>
      <td>?categorield=7&typeAnnonceld=2</td>
      <td>?typeAnnonceld=2&categorield=10</td>
    </tr>
    <tr>
      <td>Électronique à vendre</td>
      <td>?categorield=5&typeAnnonceld=1</td>
      <td>?typeAnnonceld=3&categorield=11</td>
    </tr>
  </tbody>
</table>

**Note about Maisons à louer:** the OLD URL (?categorield=6&typeAnnonceld=2) returned 0 results — that was the original bug. The NEW URL returns 22 rentable houses.

### The original bug — now fixed at the data level

Before the migration: ?categorield=6&typeAnnonceld;=2 returned 0 results. After the migration: ?typeAnnonceld=1&categorield;=8 returns 22 rentable houses. The frontend just needs to send the new URL.

Database restructure — May 2026
&lt;page_number&gt;Page 6&lt;/page_number&gt;

---


## Page 7

EDDEYAR
Migration handover document

# 5. Old ID to new ID mapping (full reference)

## typeAnnonce mapping (Level 1)

<table>
  <thead>
    <tr>
      <th>Old ID</th>
      <th>Old name</th>
      <th>New ID</th>
      <th>New name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Vente</td>
      <td>(removed — now level 2)</td>
      <td>—</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Location</td>
      <td>(removed — now level 2)</td>
      <td>—</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Service</td>
      <td>4</td>
      <td>Service</td>
    </tr>
    <tr>
      <td>4</td>
      <td>autre</td>
      <td>6</td>
      <td>Autre</td>
    </tr>
    <tr>
      <td>39</td>
      <td>Demande</td>
      <td>5</td>
      <td>Demande</td>
    </tr>
  </tbody>
</table>

## categorie mapping (Level 2)

<table>
  <thead>
    <tr>
      <th>Old (type, cat)</th>
      <th>Old name</th>
      <th>New (type, cat)</th>
      <th>New name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>(1, 5)</td>
      <td>Vente / Phones-IT</td>
      <td>(3, 11)</td>
      <td>Electronique / Vente</td>
    </tr>
    <tr>
      <td>(1, 6)</td>
      <td>Vente / Maisons</td>
      <td>(1, 7)</td>
      <td>Maison / Vente</td>
    </tr>
    <tr>
      <td>(1, 7)</td>
      <td>Vente / Voitures</td>
      <td>(2, 9)</td>
      <td>Voiture / Vente</td>
    </tr>
    <tr>
      <td>(1, 8)</td>
      <td>Vente / autre cat</td>
      <td>(6, null)</td>
      <td>Autre</td>
    </tr>
    <tr>
      <td>(2, 9)</td>
      <td>Location / Maisons</td>
      <td>(1, 8)</td>
      <td>Maison / Location</td>
    </tr>
    <tr>
      <td>(2, 10)</td>
      <td>Location / Voitures</td>
      <td>(2, 10)</td>
      <td>Voiture / Location</td>
    </tr>
    <tr>
      <td>(2, 11)</td>
      <td>Location / autre cat</td>
      <td>(6, null)</td>
      <td>Autre</td>
    </tr>
    <tr>
      <td>(3, 12)</td>
      <td>Service / réparation</td>
      <td>(4, 12)</td>
      <td>Service / réparation</td>
    </tr>
    <tr>
      <td>(3, 15)</td>
      <td>Service / nettoyage</td>
      <td>(4, 13)</td>
      <td>Service / nettoyage</td>
    </tr>
    <tr>
      <td>(3, 16)</td>
      <td>Service / enseignement</td>
      <td>(4, 14)</td>
      <td>Service / enseignement</td>
    </tr>
    <tr>
      <td>(3, 17)</td>
      <td>Service / autres</td>
      <td>(4, 16)</td>
      <td>Service / autres</td>
    </tr>
    <tr>
      <td>(3, 38)</td>
      <td>Service / distrib. eau</td>
      <td>(4, 15)</td>
      <td>Service / distrib. eau</td>
    </tr>
  </tbody>
</table>

## souscategorie mapping (Level 3)

<table>
  <thead>
    <tr>
      <th>Old sub</th>
      <th>Old name</th>
      <th>New sub</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>18</td>
      <td>Appart(s)</td>
      <td>17</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 7&lt;/page_number&gt;

---


## Page 8

EDDEYAR
Migration handover document

<table>
  <thead>
    <tr>
      <th>Old sub</th>
      <th>Old name</th>
      <th>New sub</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>19</td>
      <td>Maison(s)</td>
      <td>18</td>
    </tr>
    <tr>
      <td>20</td>
      <td>Terrain(s)</td>
      <td>19</td>
    </tr>
    <tr>
      <td>21</td>
      <td>autre</td>
      <td>20</td>
    </tr>
    <tr>
      <td>22</td>
      <td>telephone</td>
      <td>34</td>
    </tr>
    <tr>
      <td>23</td>
      <td>ordinateur portable</td>
      <td>35</td>
    </tr>
    <tr>
      <td>24</td>
      <td>autres</td>
      <td>36</td>
    </tr>
    <tr>
      <td>25</td>
      <td>voiture (Vente)</td>
      <td>27</td>
    </tr>
    <tr>
      <td>26</td>
      <td>camion</td>
      <td>28</td>
    </tr>
    <tr>
      <td>27</td>
      <td>citerne</td>
      <td>29</td>
    </tr>
    <tr>
      <td>28</td>
      <td>autres (Vente voitures)</td>
      <td>30</td>
    </tr>
    <tr>
      <td>29</td>
      <td>maison</td>
      <td>21</td>
    </tr>
    <tr>
      <td>30</td>
      <td>maison meublée</td>
      <td>22</td>
    </tr>
    <tr>
      <td>31</td>
      <td>appartement</td>
      <td>23</td>
    </tr>
    <tr>
      <td>32</td>
      <td>appartement meublée</td>
      <td>24</td>
    </tr>
    <tr>
      <td>33</td>
      <td>magasin</td>
      <td>25</td>
    </tr>
    <tr>
      <td>34</td>
      <td>boutique</td>
      <td>26</td>
    </tr>
    <tr>
      <td>35</td>
      <td>voiture (Location)</td>
      <td>31</td>
    </tr>
    <tr>
      <td>36</td>
      <td>engins, camion</td>
      <td>32</td>
    </tr>
    <tr>
      <td>37</td>
      <td>autres (Loc voitures)</td>
      <td>33</td>
    </tr>
    <tr>
      <td>13</td>
      <td>réparation électrique</td>
      <td>37</td>
    </tr>
    <tr>
      <td>14</td>
      <td>réparation plomberie</td>
      <td>38</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 8&lt;/page_number&gt;

---


## Page 9

EDDEYAR
Migration handover document

# 6. New structure of an annonce document

Every announce in MongoDB now uses the new IDs. Here's a real example (taken from the database after migration):

```json
{
  "_id": ObjectId("68cc5f5aff334aa248be521f"),
  "typeAnnonceId": "1",
  "categorieId": "8",
  "subcategorieId": "23",
  "userId": "68c80543c0207565f17c68dc",
  "classificationFr": "Maison/Location/Appartement",
  "classificationAr": "(Arabic: aqaarat/iijaar/shaqaa)",
  "title": "Appartement a louer Tevragh Zeina",
  "description": "...",
  "price": 25000,
  "status": "active",
  "isPublished": true,
  "lieuId": "10",
  "contact": "37493029",
  "moughataaId": "1004",
  "haveImage": true,
  "directNegotiation": false,
  "isSponsored": false,
  "firstImagePath": "...",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("..."),
  "isIndexed": true,
  "categorieName": "Location",
  "categorieNameAr": "(Arabic label)",
  "isPriceHidden": false,
  "lieuStr": "Nouakchott",
  "lieuStrAr": "(Arabic location)",
  "moughataaStr": "Tevragh Zeina",
  "moughataaStrAr": "(Arabic district)",
  "typeAnnonceName": "Maison",
  "typeAnnonceNameAr": "(Arabic type)"
}
```

## Fields that changed during migration

<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>typeAnnonceId</td>
      <td>String</td>
      <td>New value (1–6)</td>
    </tr>
    <tr>
      <td>categorieId</td>
      <td>String / null</td>
      <td>New value, or null for Demande/Autre</td>
    </tr>
    <tr>
      <td>subcategorieId</td>
      <td>String / empty / null</td>
      <td>New value, or empty/null if no sub</td>
    </tr>
    <tr>
      <td>typeAnnonceName</td>
      <td>String</td>
      <td>Updated to French label</td>
    </tr>
    <tr>
      <td>typeAnnonceNameAr</td>
      <td>String</td>
      <td>Updated to Arabic label</td>
    </tr>
    <tr>
      <td>categorieName</td>
      <td>String</td>
      <td>Updated to French label, or empty</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 9&lt;/page_number&gt;

---


## Page 10

EDDEYAR
Migration handover document

<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>categorieNameAr</td>
      <td>String</td>
      <td>Updated to Arabic label, or empty</td>
    </tr>
    <tr>
      <td>classificationFr</td>
      <td>String</td>
      <td>New format: TypeAnnonce/Categorie/Sub</td>
    </tr>
    <tr>
      <td>classificationAr</td>
      <td>String</td>
      <td>New format in Arabic</td>
    </tr>
    <tr>
      <td>updatedAt</td>
      <td>Date</td>
      <td>Set to migration timestamp</td>
    </tr>
  </tbody>
</table>

**Fields that were NOT changed**

All other fields in the annonce document were preserved exactly as they were: title, description, price, status, lieuld, contact, moughataald, havelmage, createdAt, isSponsored, isPriceHidden, directNegotiation, and all image references.

Database restructure — May 2026
&lt;page_number&gt;Page 10&lt;/page_number&gt;

---


## Page 11

EDDEYAR
Migration handover document

# 7. Query examples for the frontend

Here are the most common queries the frontend will need to make. All counts shown are real numbers from the production database after migration.

## Browse by top-level type

```javascript
// All Maison ads (returns 60)
db.annonces.find({ typeAnnonceId: '1' })

// All Voiture ads (returns 17)
db.annonces.find({ typeAnnonceId: '2' })

// All Service ads (returns 4)
db.annonces.find({ typeAnnonceId: '4' })

// All Demande ads (returns 11)
db.annonces.find({ typeAnnonceId: '5' })
```

## Combined filter (type + transaction)

```javascript
// Maisons à vendre (returns 38)
db.annonces.find({
typeAnnonceId: '1',
categorieId: '7'
})

// Maisons à louer (returns 22) - the bug we fixed
db.annonces.find({
typeAnnonceId: '1',
categorieId: '8'
})

// Voitures à louer (returns 3)
db.annonces.find({
typeAnnonceId: '2',
categorieId: '10'
})
```

## Specific sub-category filter

```javascript
// Studios meublés à louer (Maison > Location > Appartement meublée)
db.annonces.find({
typeAnnonceId: '1',
categorieId: '8',
subcategorieId: '24'
})

// Camions à vendre (Voiture > Vente > Camion)
db.annonces.find({
typeAnnonceId: '2',
categorieId: '9',
subcategorieId: '28'
})
```

Database restructure — May 2026
&lt;page_number&gt;Page 11&lt;/page_number&gt;

---


## Page 12

EDDEYAR
Migration handover document

# Loading the dropdown options from Turso

-- Step 1: load top-level types for the first dropdown
SELECT * FROM options WHERE TAG = 'typeAnnonce' ORDER BY PRIORITY;

-- Step 2: user picked Maison (id=1). Load its categories.
SELECT * FROM options WHERE PARENTID = 1 ORDER BY PRIORITY;
-- returns: Vente (id=7), Location (id=8)

-- Step 3: user picked Location (id=8). Load sub-categories.
SELECT * FROM options WHERE PARENTID = 8 ORDER BY PRIORITY;
-- returns: Maison, Maison meublée, Appartement, Appartement meublée,
-- Magasin, Boutique

Database restructure — May 2026
&lt;page_number&gt;Page 12&lt;/page_number&gt;

---


## Page 13

EDDEYAR
Migration handover document

# 8. Frontend update checklist

Here is everything the frontend developer needs to update. Tick items as they are completed.

## Filter buttons (homepage)

<table>
  <thead>
    <tr>
      <th>Item</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Replace "Immobilier" button URL: ?categorield=6 → ?typeAnnonceld=1</td>
    </tr>
    <tr>
      <td>Replace "Voiture" button URL: ?categorield=7 → ?typeAnnonceld=2</td>
    </tr>
    <tr>
      <td>Replace "Electronique" button URL: ?categorield=5 → ?typeAnnonceld=3</td>
    </tr>
    <tr>
      <td>Replace "Service" button URL: ?typeAnnonceld=3 → ?typeAnnonceld=4</td>
    </tr>
    <tr>
      <td>Replace "Demande" button URL: ?typeAnnonceld=39 → ?typeAnnonceld=5</td>
    </tr>
    <tr>
      <td>Add "Autre" button URL: ?typeAnnonceld=6</td>
    </tr>
    <tr>
      <td>Optionally relabel "Immobilier" button to "Maison" for clarity</td>
    </tr>
  </tbody>
</table>

## Advanced search / filters page

<table>
  <thead>
    <tr>
      <th>Item</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Update the type dropdown to load options where TAG='typeAnnonce' (now returns 6 items)</td>
    </tr>
    <tr>
      <td>When user picks a type, load its children via PARENTID</td>
    </tr>
    <tr>
      <td>When user picks a category, load its children via PARENTID</td>
    </tr>
    <tr>
      <td>Make sure Demande and Autre don't show a categorie dropdown (they're leaves)</td>
    </tr>
    <tr>
      <td>Make sure Electronique only shows Vente in the categorie dropdown</td>
    </tr>
    <tr>
      <td>Test combined filter URLs render correct results</td>
    </tr>
  </tbody>
</table>

## Display pages (single annonce, list view)

<table>
  <thead>
    <tr>
      <th>Item</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Verify breadcrumb (classificationFr) renders correctly</td>
    </tr>
    <tr>
      <td>Verify French/Arabic switching uses the right name fields</td>
    </tr>
    <tr>
      <td>If you cache options data on the client, clear or invalidate the cache</td>
    </tr>
    <tr>
      <td>If options are bundled at build time, rebuild the frontend</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 13&lt;/page_number&gt;

---


## Page 14

EDDEYAR
Migration handover document

## Hardcoded ID references (search the codebase)

<table>
  <thead>
    <tr>
      <th>Item</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Search for '=6' in URLs — replace category 6 references</td>
    </tr>
    <tr>
      <td>Search for typeAnnonceld === '1' — meaning has changed (was Vente, now Maison)</td>
    </tr>
    <tr>
      <td>Search for typeAnnonceld === '39' — replace with '5'</td>
    </tr>
    <tr>
      <td>Search for typeAnnonceld === '2' — meaning has changed (was Location, now Voiture)</td>
    </tr>
    <tr>
      <td>Search for typeAnnonceld === '3' — meaning has changed (was Service, now Electronique)</td>
    </tr>
    <tr>
      <td>Update any analytics/tracking that uses category names</td>
    </tr>
    <tr>
      <td>Update any breadcrumb logic that assumes type-first order</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 14&lt;/page_number&gt;

---


## Page 15

EDDEYAR
Migration handover document

# 9. Useful search commands for the codebase

Run these commands inside your project folder to find every place that needs updating.

## Find hardcoded category IDs

```bash
# Find old IDs in JS/TS/JSX/TSX files
grep -rn "categorieId.*['\"]6['\"]" --include="*.{js,ts,jsx,tsx}"
grep -rn "categorieId.*['\"]7['\"]" --include="*.{js,ts,jsx,tsx}"
grep -rn "categorieId.*['\"]5['\"]" --include="*.{js,ts,jsx,tsx}"
grep -rn "typeAnnonceId.*['\"]39['\"]" --include="*.{js,ts,jsx,tsx}"
grep -rn "typeAnnonceId.*['\"]1['\"]" --include="*.{js,ts,jsx,tsx}"

# Find references by name
grep -rn "Immobilier" --include="*.{js,ts,jsx,tsx}"
grep -rn "Vente" --include="*.{js,ts,jsx,tsx}"
grep -rn "Location" --include="*.{js,ts,jsx,tsx}"

# Find hardcoded URLs
grep -rn "categorieId=6" --include="*.{js,ts,jsx,tsx}"
grep -rn "typeAnnonceId=39" --include="*.{js,ts,jsx,tsx}"

# Find any reference to the changed category names
grep -rn "Maisons" --include="*.{js,ts,jsx,tsx}"
grep -rn "tel,informatique" --include="*.{js,ts,jsx,tsx}"
```

# 10. Testing scenarios

Once the frontend is updated, walk through these scenarios end-to-end:

<table>
  <thead>
    <tr>
      <th>Scenario</th>
      <th>Expected result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>☑ Open homepage</td>
      <td>Shows all 95 announces</td>
    </tr>
    <tr>
      <td>☑ Click Maison</td>
      <td>Shows 60 announces (38 Vente + 22 Location)</td>
    </tr>
    <tr>
      <td>☑ Click Maison + Vente</td>
      <td>Shows 38 announces</td>
    </tr>
    <tr>
      <td>☑ Click Maison + Location</td>
      <td>Shows 22 announces (this was the bug)</td>
    </tr>
    <tr>
      <td>☑ Click Voiture</td>
      <td>Shows 17 announces</td>
    </tr>
    <tr>
      <td>☑ Click Voiture + Location</td>
      <td>Shows 3 announces</td>
    </tr>
    <tr>
      <td>☑ Click Electronique</td>
      <td>Shows 2 announces</td>
    </tr>
    <tr>
      <td>☑ Click Service</td>
      <td>Shows 4 announces</td>
    </tr>
    <tr>
      <td>☑ Click Demande</td>
      <td>Shows 11 announces</td>
    </tr>
    <tr>
      <td>☑ Open a single Maison/Location announce</td>
      <td>Breadcrumb: Maison/Location/...</td>
    </tr>
    <tr>
      <td>☑ Switch language to Arabic</td>
      <td>All names appear in Arabic</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 15&lt;/page_number&gt;

---


## Page 16

EDDEYAR
Migration handover document

<table>
  <thead>
    <tr>
      <th>Scenario</th>
      <th>Expected result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>☑ Post a new announce as Vente Maison Appart</td>
      <td>Saves with typeAnnonceld='1', categorield='7', subcategorield='17'</td>
    </tr>
    <tr>
      <td>☑ Search for keyword + filter</td>
      <td>Both filters combine correctly</td>
    </tr>
  </tbody>
</table>

Database restructure — May 2026
&lt;page_number&gt;Page 16&lt;/page_number&gt;

---


## Page 17

EDDEYAR
Migration handover document

# 11. If something goes wrong

## The migration is reversible

A complete backup was taken before the migration. If a critical issue is found, the rollback script (05-rollback.sh) restores both Turso and MongoDB to their pre-migration state in about 3 minutes.

## Common issues and fixes

<table>
  <thead>
    <tr>
      <th>Symptom</th>
      <th>Likely cause</th>
      <th>Fix</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Filter button shows 0 results</td>
      <td>Old categorield still hardcoded in URL</td>
      <td>Update URL to new IDs (section 4)</td>
    </tr>
    <tr>
      <td>Single annonce page shows wrong category</td>
      <td>Frontend reads denormalized name fields, but cache is stale</td>
      <td>Clear cache, rebuild frontend</td>
    </tr>
    <tr>
      <td>Dropdown shows old category names</td>
      <td>Frontend has bundled options data at build time</td>
      <td>Refresh options from Turso, or rebuild</td>
    </tr>
    <tr>
      <td>Posting an annonce fails validation</td>
      <td>Form sends old IDs that no longer exist</td>
      <td>Update form's category picker to use new IDs</td>
    </tr>
    <tr>
      <td>Some announces don't appear in the filter</td>
      <td>They have typeAnnonceId='6' (Autre) — Adder 'Autre' filter button</td>
      <td></td>
    </tr>
  </tbody>
</table>

# 12. Summary

**What changed:** The category tree was restructured from type-first to category-first. Six top-level types now exist: Maison, Voiture, Electronique, Service, Demande, Autre.

**What didn't change:** The schema of the annonces collection (same field names, same MongoDB structure). All textual content (titles, descriptions, prices, images) is preserved.

**What needs to be done now:** Update the frontend filter URLs (section 4), update any hardcoded ID references (section 9), and run through the test scenarios (section 10).

## Next steps

1. Read sections 4 and 8 carefully. 2. Run the search commands from section 9 to find affected files. 3. Update the URLs and hardcoded IDs. 4. Rebuild and deploy. 5. Walk through the test scenarios in section 10. 6. Confirm everything works before marking the task complete.

Database restructure — May 2026
&lt;page_number&gt;Page 17&lt;/page_number&gt;