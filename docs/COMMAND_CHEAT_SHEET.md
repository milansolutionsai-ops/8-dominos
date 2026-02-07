# 🏁 8 Dominos: Terminal Cheat Sheet

This guide contains all the commands you need to manage, develop, and build your app.

---

### 📂 1. Getting Started (Navigation)
Run these when you first open your terminal/PowerShell.

| Command | Description |
| :--- | :--- |
| `cd "C:\Users\Milan\Desktop\8 Dominos"` | **Enter the Project**: Move your terminal into the app folder. |
| `ls` (or `dir`) | **List Files**: Check if you are in the right place (you should see `package.json`). |

---

### 💻 2. Daily Development
Use these for coding and testing the UI.

| Command | Description |
| :--- | :--- |
| `npm run dev` | **Start App**: Launches the Expo server and generates the QR code. |
| `npx expo install <package>` | **Add Features**: Use this if you ever need to add a new official Expo library. |

---

### 🚀 3. EAS & Build Commands (Native Apps)
Use these to create the real Android and iOS apps.

| Command | Description |
| :--- | :--- |
| `eas login` | **Connect Account**: Run this once to link your computer to your Expo account. |
| `$env:EAS_NO_VCS=1; eas build -p android --profile preview` | **Generate Android APK**: Creates the installer file. Includes a bypass for Git. |
| `$env:EAS_NO_VCS=1; eas build -p ios --profile development` | **Generate iOS App**: Creates the build for your iPhone (development version). |
| `eas build --list` | **Check Status**: See a list of your current and past build attempts. |

---

### 🛠️ 4. Maintenance
| Command | Description |
| :--- | :--- |
| `npm install` | **Update Project**: Run this if you ever download the code to a new computer. |
| `npx expo-doctor` | **Health Check**: Checks if any libraries are conflicting or need updates. |

---

### 🐙 5. Source Control (GitHub)
*First, install [Git for Windows](https://git-scm.com/download/win).*

| Command | Description |
| :--- | :--- |
| `git init` | **Initialize**: Start tracking changes in this folder. |
| `git add .` | **Stage**: Tell Git to prepare all files for a save. |
| `git commit -m "Initial commit"` | **Save**: Create a snapshot of your project with a message. |
| `git branch -M main` | **Rename**: Set the main branch name (standard for GitHub). |
| `git remote add origin <URL>` | **Link**: Connect your local folder to your GitHub repository. |
| `git push -u origin main` | **Upload**: Send your local saves to GitHub. |
| `git push -f origin main` | **Force Upload**: Use this ONLY if the first push is "rejected". |

---

### 🔄 6. Daily Save & Update (After Setup)
Once Section 5 is done, use these 3 simple commands to save your progress daily:

1. `git add .` (Gather changes)
2. `git commit -m "Describe your change"` (Save snapshot)
3. `git push` (Upload to GitHub)

---

### ⚠️ 7. Fixing Build Errors (Gradle Failed)
If your `eas build` fails with a "Gradle" or "Prebuild" error, run this to reset the native files:

| Command | Description |
| :--- | :--- |
| `rm -r android, ios` | **Clean Folders**: Deletes the conflicting native folders. |

---

### 🆘 8. Recovery & Undoing (The Safety Net)

| Scenario | Command |
| :--- | :--- |
| **"I deleted my folder!"** | `git clone <URL>` |
| **"I broke my code - Undo!"** | `git restore .` |
| **"Get latest from Cloud"** | `git pull` |

---

> [!TIP]
> **Pro Tip**: In PowerShell, you can press the **Up Arrow** key to cycle through your previous commands so you don't have to type them every time!
