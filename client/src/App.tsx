import { ArchiveCardSection } from "./components/ArchiveCardSection";
import { Stats } from "./components/Stats";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
function App() {
  return (
    <div className="w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12 m-auto">
      <Header />
      <Stats />
      <ArchiveCardSection />
      <Footer />
    </div>
  );
}

export default App;
