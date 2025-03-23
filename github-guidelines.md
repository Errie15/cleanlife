# GitHub Push Guidelines

## Guide för att pusha ändringar till GitHub

### Förberedelser
1. Kontrollera aktuell status:
   ```bash
   git status
   ```

2. Sätt upp Git-konfiguration om det inte redan är gjort:
   ```bash
   git config --global user.name "erikh"
   git config --global user.email "erikhelsing88@gmail.com"
   ```

### Steg för att pusha ändringar
1. Lägg till ändrade filer till staging area:
   ```bash
   # Lägg till alla ändrade filer
   git add .
   
   # Eller lägg till specifika filer
   git add filnamn.js
   ```

2. Skapa en commit med beskrivande meddelande:
   ```bash
   git commit -m "Beskrivande commit-meddelande"
   ```

3. Pusha ändringar till GitHub:
   ```bash
   # För att pusha till main-branchen
   git push origin main
   
   # För en annan branch
   git push origin branch-namn
   ```

### Hantera vanliga problem
- Om push avvisas på grund av ändringar på servern:
  ```bash
  git pull origin main
  git push origin main
  ```

- Om du behöver avbryta lokala ändringar:
  ```bash
  git reset --hard origin/main
  ```

- Om du behöver uppdatera remote URL:
  ```bash
  git remote set-url origin https://github.com/Errie15/cleanlife.git
  # Eller med SSH
  git remote set-url origin git@github.com:Errie15/cleanlife.git
  ```

### För Windows PowerShell-användare
- Använd semikolon (;) istället för && för att kedja kommandon:
  ```powershell
  cd projektsökväg; git add .; git commit -m "Meddelande"; git push origin main
  ```

### Repository för CleanLife projektet
- HTTPS: `https://github.com/Errie15/cleanlife.git`
- SSH: `git@github.com:Errie15/cleanlife.git` 