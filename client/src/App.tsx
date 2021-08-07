import { ArchiveCardSection } from "./components/ArchiveCardSection";
import { Chart } from "./components/Chart";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
function App() {
  return (
    <div className="w-11/12 m-auto">
      <Header />
      <Chart />
      <ArchiveCardSection />
      <Footer />
    </div>
  );
}

export default App;
