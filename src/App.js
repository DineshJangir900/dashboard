import React, { useState } from "react";
import DashboardHome from "./components/DashboardHome";
import CategoryScreen from "./components/CategoryScreen";
import "./styles.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="app">
      {!selectedCategory ? (
        <DashboardHome onSelect={setSelectedCategory} />
      ) : (
        <CategoryScreen
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}

export default App;