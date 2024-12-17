
# Karlo IDE

Karlo IDE is a browser-based **interactive development environment** for solving grid-based programming tasks inspired by Karel the Robot. 
It allows users to interact with a robot in predefined **worlds** by writing code, running it, and observing the robot's behavior directly in the browser.

Access catalog from [here](https://rezi-gelenidze.github.io/karlo-ide/catalog.html)

---

## Project Structure

- **catalog.html**: The catalog page that dynamically lists all available tasks.
- **index.html**: The main IDE page that loads a specific task and its associated worlds.
- **tasks/**: A folder that contains all tasks, each in its own subfolder.
  - **manifest.json** (inside `tasks/`): A global file listing all available tasks.

Each **task** has its own folder structured as follows:
```
tasks/TASKNAME/
├── starter.py       # The starter code for the task
├── world1.w         # A world file for the task
├── world2.w         # Additional world files (optional)
└── manifest.json    # A task-specific manifest
```

---

## How to Add a New Task

To create and add a new task to the IDE, follow these steps:

1. **Create a Task Folder**:
   - Navigate to the `tasks/` directory.
   - Create a new folder named `TASKNAME` (e.g., `beeperCollector`).

2. **Add Required Files**:
   Inside the `TASKNAME/` folder, add the following files:
   - `starter.py`: A Python file containing the starter code for the task.
   - `.w` files (e.g., `world1.w`, `world2.w`): Files defining the worlds for the task.

3. **Create a Task Manifest**:
   - Inside the `TASKNAME` folder, create a `manifest.json` file to describe the task.  
   Example:
   ```json
   {
     "worlds": ["world1.w", "world2.w"],
     "defaultWorld": "world1.w",  
     "beepers": 10
   }
   ```

   beepers is positive integer of "INFINITY" and defaultWorld is string filename of one of the entries of worlds array

5. **Update the Global Manifest**:
   - Open `tasks/manifest.json`.
   - Add the `TASKNAME` to the `"tasks"` list:
     ```json
     {
       "tasks": [
         "beeperCollector",
         "cornerBeepers",
         "newTaskName"
       ]
     }
     ```

---

## Catalog Page

The **catalog page** (`catalog.html`) dynamically loads the tasks listed in `tasks/manifest.json`. Each task links to its IDE page.

You can access the catalog here:
```
https://<your-repo-url>/catalog.html
```

---

## Task IDE Page

To load a specific task, navigate to the following URL:
```
https://<your-repo-url>/?task=TASKNAME
```

Replace `TASKNAME` with the name of your task folder.

For example:
```
https://<your-repo-url>/?task=beeperCollector
```

---

## Example

For a task `beeperCollector`:
1. Folder structure:
   ```
   tasks/beeperCollector/
   ├── starter.py
   ├── world1.w
   ├── world2.w
   └── manifest.json
   ```

2. Global `tasks/manifest.json`:
   ```json
   {
     "tasks": [
       "beeperCollector",
       "cornerBeepers",
       "newTaskName"
     ]
   }
   ```

3. Task manifest (`tasks/beeperCollector/manifest.json`):
   ```json
   {
     "worlds": ["world1.w", "world2.w"],
     "defaultWorld": "world1.w",
     "beepers": 5
   }
   ```

4. Access the task via:
   ```
   https://<your-repo-url>/?task=beeperCollector
   ```

---

This structure allows easy management of tasks, worlds, and starter code while keeping everything organized and extensible.
