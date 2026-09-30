import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import Menu from './components/Menu';
import Experience from './components/Experience';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Reservation from './components/Reservation';
import Visit from './components/Visit';
import AudioBar from './components/AudioBar';
import CartDrawer from './components/CartDrawer';
import ItemDetailModal from './components/ItemDetailModal';
import CoffeeSommelierModal from './components/CoffeeSommelierModal';

export default function App() {
  return (
    <ShopProvider>
      <div className="bg-[#0d0a07] text-[#f3ead9] min-h-screen selection:bg-[#c9a25e] selection:text-[#0d0a07]">
        <Navbar />
        <main>
          <Hero />
          <Story />
          <Menu />
          <Experience />
          <Gallery />
          <Reservation />
          <Reviews />
          <Visit />
        </main>

        {/* Global Interactive Luxury Modals & Floating Tools */}
        <AudioBar />
        <CartDrawer />
        <ItemDetailModal />
        <CoffeeSommelierModal />
      </div>
    </ShopProvider>
  );
}
