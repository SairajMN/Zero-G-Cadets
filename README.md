# 🚀 Beyond Earth – Junior Astronaut Mission Trainer

**Team:** Zero-G Cadets  
**Challenge:** Build a Junior Astronaut Mission Trainer (NASA Space Apps Challenge 2026)  
**Live Playable Link:** https://engr-aimanafzal.github.io/Zero-G-Cadets/

## 📖 Project Overview
"Beyond Earth" is a 3D browser-based survival game designed for kids aged 7-12. Players control a Junior Astronaut on a lunar outpost and must manage limited resources (Power, Oxygen, and Health) to survive. The game teaches real engineering trade-offs: turning on the Oxygen Recycler drains Power, and activating Radiation Shields drains Power even faster. No choice is free.

## 🎮 How to Play
*   **Movement:** Use `W`, `A`, `S`, `D` or the Arrow Keys.
*   **Interaction:** Walk up to the glowing modules and press `E` to turn them on/off.
*   **Objective:** Survive for 90 seconds. Collect green crates for Oxygen and red crates for Health.
*   **Warning:** Every 25 seconds, a Solar Flare will hit. You have 5 seconds to run to a Shield Generator before radiation damages your crew.
*   **Science Score:** Your final score is calculated based on how well you balanced your remaining Power, Oxygen, and Health.

## 🔬 NASA Data Integration (Traceability)
To meet NASA's requirement for real-world data grounding, this game integrates the following tools from the official NASA Resources tab:

*   **DONKI (Space Weather Database):** The game uses a live `fetch()` request to the NASA Open API (using the updated CCMC server). It pulls the most recent real solar flare data (Class and Date) from the last 30 days and displays it in the game UI and during in-game events. 
*   **OSDR (Open Science Data Repository) & RadLab:** The Crew Health meter and radiation damage mechanics are informed by the OSDR RadLab dosimetry database (absorbed dose rate on the ISS) and biological research on astronaut radiation exposure.
*   **Artemis (Lunar Environment):** As a lunar outpost simulation, the resource constraints (Oxygen and Power budgeting) and the environmental hazards are grounded in NASA's Artemis mission parameters for sustaining a presence on the Moon.

*Note: Due to the static nature of the GitHub Pages deployment, we embedded curated real data from the OSDR database directly into the game logic (as permitted by the challenge guidelines) to teach the biological impact of radiation, while maintaining a live API connection to DONKI for space weather events.*

## 🛠️ Tech Stack
*   **HTML5 / CSS3**
*   **JavaScript (ES6 Modules)**
*   **Three.js** (WebGL 3D Engine)
*   **NASA DONKI API** (Live solar flare data integration)
