Sure! Here's your setup guide formatted in **Markdown**:

---

## 🚀 How to Run the Game – CapySpace

### 1. Clone the Repository

```bash
git clone https://github.com/Migue-IA/CapySpace.git
```

### 2. Start Katana

In a **new terminal**, run:

```bash
katana --dev --http.api dev,starknet --dev.no-fee --http.cors_origins '*'
```

### 3. Build and Migrate the Contracts

In your **main terminal**, run:

```bash
cd new_contract
sozo build && sozo migrate
```

This will output a `WORLD_ADDRESS`.

### 4. Start Torii

Using the `WORLD_ADDRESS` from the previous step, run:

```bash
torii --world WORLD_ADDRESS --http.cors_origins '*'
```

### 5. Run the Client

Go to the client folder and start the frontend:

```bash
cd ../client
pnpm run dev
```

---

### 6. Open the browser

Then go to http://localhost:5173/ or your dedicated localhost