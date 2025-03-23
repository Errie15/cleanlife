📘 Produktkravdokument (PRD) – Hushållssysslor Webapp
🧭 1. Översikt
Ett enkelt, snyggt och användarvänligt webbverktyg för två personer att hålla reda på hushållssysslor, fördela ansvar växelvis, kommunicera direkt i appen, och få belöningar för större insatser.
Webappen ska vara optimerad för iPhone och användas live via Vercel.

👥 2. Användare
Max 2 användare (du och din sambo)
Ingen inloggning krävs
Användare identifieras via initialer eller förnamn
Data lagras lokalt eller i backend utan autentisering
🧹 3. Funktioner
3.1 Sysslor (Chores)
Skapa ny syssla
Titel (ex: “Dammsuga”)
Typ: “Engångs” eller “Återkommande”
Kategori: “Vardaglig” eller “Större”
Frekvens: en gång / varje vecka / varannan vecka / månadsvis
Markera som klar
Visa vem som ansvarar för veckans sysslor (växlas varje vecka)
Spara historik (valfritt)
3.2 Veckorotation
Automatisk fördelning varje vecka:
Om användare A ansvarade förra veckan, ansvarar B denna vecka
Gäller för återkommande vardagliga sysslor
3.3 Belöningssystem
Större sysslor ger poäng
Belöningsbutik:
Lista över belöningar (ex: massage, frukost på sängen)
Varje belöning kostar ett visst antal poäng
Välj belöning → tas bort från listan tills uppfylld
3.4 Notiser
In-app-notis när en syssla markeras som klar
"X har gjort klart Dammsuga"
3.5 Chatt
Enkel chattvy där användare kan skicka korta meddelanden till varandra
Bubblor med tidpunkt och avsändare
🧱 4. Tekniska delar
4.1 Frontend (Webapp)
Ramverk: React + Vite
CSS: Tailwind CSS
Design: Trello-inspirerad layout med kort i kolumner
“Veckans sysslor” (uppgifter)
“Klara sysslor”
“Större uppgifter”
Chatt längst ner eller i sidopanel
Responsiv layout med mobilförst-design
Extra optimering för iPhone:
Touchvänliga element
Mobilvänliga kort
Testad på 390×844 viewport (iPhone 13)
<meta name="viewport" content="width=device-width, initial-scale=1.0">
4.2 Backend / Datamodell
Om backend används:

Tabell: chores
| id | title | category | frequency | assigned_to | status | created_at |

Tabell: users
| id | name | color |

Tabell: rewards
| id | name | points_cost | claimed_by | claimed_at |

Tabell: messages
| id | sender | message | timestamp |

Alternativ: Spara allt i localStorage för enklare MVP.

4.3 Rotation & Notiser
Veckovis rotation (kan beräknas baserat på datum)
In-app notiser (t.ex. med toast eller liten badge)
✅ 5. TODO-lista (För Agenten)
📦 Datamodell
 Definiera modell för chores, rewards, users, messages
 Skapa dummydata för test
💻 Frontend
 Sätta upp projekt (React/Vite)
 Layout:
 Trello-inspirerad kolumnvy
 Komponent för varje syssla
 Skapa-formulär för nya sysslor
 Lista med veckosysslor + markering "klar"
 Rotation-etikett (t.ex. “Din vecka”)
 Chatt-komponent
 Belöningsbutik (poäng + val)
 Notifiering/toast-system
🔁 Logik
 Hantering av återkommande sysslor
 Veckovis rotation baserat på veckonummer
 Poängräkning för större sysslor
 Belöningssystem med "claim"-logik
💾 Lagring
 Välj mellan:
 LocalStorage (ingen backend)
 Spara chatt, sysslor, poäng och rotation
🎨 Design
 Trello-liknande layout
 Färgkodade användare
 Minimalistisk men tilltalande UI (t.ex. TailwindCSS)
 iPhone-anpassning: mobilförst, testad på Safari i iOS
🌐 6. Distribution & GitHub-integration
📁 Setup
bash
Copy
Edit
npm create vite@latest cleanlife -- --template react
cd cleanlife
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
Konfigurera tailwind.config.js:

js
Copy
Edit
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
I src/index.css:

css
Copy
Edit
@tailwind base;
@tailwind components;
@tailwind utilities;
Lägg till i index.html:

html
Copy
Edit
<meta name="viewport" content="width=device-width, initial-scale=1.0">
🔗 GitHub
bash
Copy
Edit
git init
git remote add origin https://github.com/<användarnamn>/cleanlife.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
🚀 Vercel
Gå till vercel.com → New Project
Importera repo cleanlife från GitHub
Välj:
Build command: npm run build
Output dir: dist
Deploy – du får en live URL för iPhone!
📅 7. Roadmap (MVP först, sen extra)
Steg	Funktion	Klar?
1	Grundlayout + dummydata	☐
2	Skapa sysslor + markera klar	☐
3	Rotation per vecka	☐
4	Poängsystem + belöningslista	☐
5	Enkel chatt	☐
6	Notiser (in-app)	☐
7	Snygg design + polish	☐
8	Vercel deploy + test på iPhone	☐