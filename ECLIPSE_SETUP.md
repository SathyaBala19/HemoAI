# Running HemoAI in Eclipse

HemoAI is 7 separate projects (5 Spring Boot services, one Python
service, one React app), not one big Eclipse project. Import them
separately as below.

## Requirements

- Eclipse IDE for Enterprise Java and Web Developers (includes m2e for
  Maven and a built-in Terminal view)
- JDK 21 registered in Eclipse (**Window > Preferences > Java > Installed
  JREs**)
- MySQL running locally (`root` / `omen`, or override via `DB_USERNAME`/
  `DB_PASSWORD` env vars)
- Node.js + npm installed (for the frontend)
- Python 3.10+ installed (for `ml-service`)
- Ollama installed and running, with a model pulled (for the Chatbot
  screen only - everything else works without it)

---

## For Java developers - the 5 backend services

Each of `auth-service`, `employee-service`, `inventory-service`,
`donation-service`, `chatbot-service` is its own Maven/Spring Boot
project with `.project`/`.classpath` already set up.

1. **File > Import > Maven > Existing Maven Projects**
2. Root directory: browse to `HemoAI/backend`, tick **"Search nested
   projects"** if shown, so it picks up all 5 at once
3. Select all 5 pom.xml entries > Finish
4. If you see **"Unbound classpath container: JRE System Library
   [JavaSE-21]"**: register your JDK 21 install under **Window >
   Preferences > Java > Installed JREs**, then right-click each project
   > **Maven > Update Project...** (check "Force Update of
   Snapshots/Releases")
5. Run each service: right-click the project > **Run As > Spring Boot
   App** (or **Java Application**, running the `*Application.java` main
   class). Each one needs to be started separately - they're independent
   processes on ports 8081-8085.

If Maven shows **"Cannot access Key[type=org.apache.maven.project...]"**
errors, that's stale workspace metadata, not a real project problem:
close Eclipse, reopen it, then **Maven > Update Project...** again on
all 5.

## For web developers - the frontend

The `frontend/` folder has a `.project` file so it shows up in Eclipse's
Project Explorer too, but Eclipse has no built-in React/Vite runner -
you run it from a terminal, same as any Node project.

1. **File > Import > General > Existing Projects into Workspace**, point
   at `HemoAI/frontend`
2. Open a terminal on it: right-click the project > **Show In > Terminal**
   (or **Window > Show View > Terminal**, then `cd` into it)
3. First time only: `npm install`
4. `npm run dev` - opens on `http://localhost:5173`

A ready-made **External Tools** launch config is included
(`frontend/Run Frontend (npm run dev).launch`) - after importing the
project, it appears under **Run > External Tools > External Tools
Configurations...** as "Run Frontend (npm run dev)", so you can start it
with one click instead of typing the command.

## ml-service (Python) - optional, only needed for the Forecast screen

Eclipse can run this too if you have the PyDev plugin installed, but
it's simplest from a terminal:

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

## Easiest path: just use start.bat

If you don't need to debug inside Eclipse and just want everything
running, `start.bat` in the project root builds and launches all 5 Java
services + ml-service + the frontend, and opens the browser
automatically. Eclipse is only needed if you want to read/debug the Java
code with breakpoints.
