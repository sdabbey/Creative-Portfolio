import { createRoot } from 'react-dom/client';
import './styles.css';
import { App } from './App';
import { useState, useEffect } from 'react';

const localImage = (filename) => `/images/${filename}`;

const Main = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set the initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setImages([
      // Front
      { position: isMobile ? [0, .8, -0.6] : [0, 0, -0.6], rotation: [0, 0, 0], url: localImage('1.jpeg'), title: 'THE STAND OF THE FORGOTTEN', description: "A solitary figure stands rooted in the desolate landscape, embodying resilience amidst environmental decay. The figure's skin is cracked, like parched earth, symbolizing the scars of land ravaged by galamsey. The surrounding bare trees and murky waters speak of a lost ecosystem, stripped of its life. This stance — solid, grounded, almost tree-like — reflects humanity's silent plea to reclaim harmony with nature.", insight: "\“To restore harmony, we must stand firm, like this solitary figure, in our commitment to preserve and rejuvenate the earth.\”" },
      // Back
      { position: isMobile ? [1.5, .8, -0.6] : [-1.5, 0, -0.6], rotation: [0, 0, 0], url: localImage('2.jpeg'), title: 'SILENT WITNESS TO DESTRUCTION', description: "This figure, sculpted from cracked earth and lined with veins of gold, stands knee-deep in a barren landscape. With its back facing the viewer, the figure gazes into the distance, evoking a sense of isolation and loss. The gold veins symbolize greed, eating into the figure’s cracked skin, much like illegal mining strips the land of its resources. The setting sun in the background casts a melancholic glow, symbolizing the dying hope of a once-thriving environment.", insight: "\“Greed burns the earth to ashes, leaving behind a desolate legacy for generations to mourn.\”" },
      { position: isMobile ? [1.5, -1.2, -0.6] : [-3, 0, -0.6], rotation: [0, 0, 0], url: localImage('3.jpeg'), title: 'THE CALL OF ANCESTRAL GROUND', description: "Captured from behind, the figure reaches out toward a cracked, arid earth, a visual call to reconnect with ancestral lands now desecrated by galamsey. The contrast between the figure's form and the fractured ground represents the lost connection between people and land. It's an invitation — to return, restore, and preserve the spirit of the land that once nurtured generations.", insight: "\"Galamsey’s scars do not only mar the soil but sever our bond with generations past.\”" },
      { position: isMobile ? [0, -1.2, -0.6] : [1.5, 0, -0.6], rotation: [0, 0, 0], url: localImage('4.jpeg'), title: 'LOST YOUTH IN A FOREST OF DESOLATION', description: "This monochromatic image shows a young man in a forest of lifeless, gnarled trees. The ground is littered with broken branches, and other figures stand scattered in the misty background, each one appearing equally lost. The scene speaks to the generational impact of galamsey—how young lives are surrounded by a landscape robbed of its vitality, forced to grow in the shadow of destruction.", insight: "\"When we strip the land bare, we leave our children with only memories of what once was.\"" },
      { position: isMobile ? [-1.5, .8, -0.6] : [3, 0, -0.6], rotation: [0, 0, 0], url: localImage('5.jpeg'), title: 'VULNERABLE AMIDST THE BARREN',  description: "A young man, bare-chested, walks alone among barren trees, the cracked ground beneath him a testament to a land stripped of life. His expression is solemn, his gaze distant, embodying both the resilience and sorrow of communities impacted by illegal mining. The trees, stripped bare, mirror his vulnerability in a world stripped of its natural resources.", insight: "\"As the trees stand lifeless, so too does the spirit of a land lost to greed.\"" },
      // Left
      { position: isMobile ? [-1.5, -3.2, -0.6] : [-3.5, 0, 0.6], rotation: [0, 0, 0], url: localImage('6.jpeg'), title: 'RESILIENCE RISING FROM THE ASHES', description: "This imposing figure, sculpted from earth, wears a draped cloth that blends with the fractured ground. Its stance is one of quiet defiance, a symbol of resilience in a ravaged landscape. The barren surroundings evoke the aftermath of destruction, where life itself struggles to find footing. The figure’s gaze forward is a reminder of the strength needed to rebuild what galamsey has destroyed.", insight: "\"When the earth crumbles, only resilience can bring life back from the ruins.\"" },
      { position: isMobile ? [-1.5, -1.2, -0.6] : [-2.7, 0, 2.6], rotation: [0, 0, 0], url: localImage('7.jpeg'), title: 'FROM ASHES TO RENEWAL', description: "Emerging from the cracked ground, this figure is both a part of and apart from the landscape, symbolizing rebirth amid destruction. His stony, textured skin is embedded with the earth's remnants, a visual reminder of how galamsey has scarred not only the land but also those who rely on it. The figure's head, textured like the rocky landscape, serves as a poignant symbol: as long as the earth endures, so does the hope for recovery and renewal.", insight: "\"From the fractured earth, a call rises—not of triumph, but of survival.\"" },
      //{ position: isMobile ? [1.5, 3, -0.6] : [-2.3, 0, 3.6], rotation: [0, 0, 0], url: localImage('8.jpeg'), title: 'VEINS OF GREED: THE COST OF GOLD', description: "This haunting figure stands in shallow water, gold veins twisting through its body like the roots of a tree. The figure’s crown of twisted branches suggests a blend of nature and suffering, while the gold overtaking its form symbolizes the insidious greed infiltrating the land. The forest backdrop, blurred and dimly lit, is a reminder of what’s at stake if illegal mining continues unchecked.", insight: "\"In the pursuit of gold, we sacrifice the veins of the earth—the lifeblood of our forests.\""},
      // Right
      { position: isMobile ? [1.5, -3.2, -0.6] : [3.5, 0, 0.6], rotation: [0, 0, 0], url: localImage('8.jpeg'), title: 'VEINS OF GREED: THE COST OF GOLD', description: "This haunting figure stands in shallow water, gold veins twisting through its body like the roots of a tree. The figure’s crown of twisted branches suggests a blend of nature and suffering, while the gold overtaking its form symbolizes the insidious greed infiltrating the land. The forest backdrop, blurred and dimly lit, is a reminder of what’s at stake if illegal mining continues unchecked.", insight: "\"In the pursuit of gold, we sacrifice the veins of the earth—the lifeblood of our forests.\"" },
      { position: isMobile ? [0, -3.2, -0.6] : [2.7, 0, 2.6], rotation: [0, 0, 0], url: localImage('9.jpeg'), title: 'WHISPERS OF RUIN',  description: "This artwork powerfully captures the haunting effects of illegal mining (galamsey) on both humanity and nature. The cracked, barren ground reflects the environmental devastation, while the figure standing boldly represents resilience and vulnerability. His open arms call for awareness, reminding viewers of our shared responsibility to protect the Earth. It evokes the paradox of human strength against nature’s fragility, urging us to rethink our actions before irreversible damage occurs.", insight: "\"In our quest for wealth, we tear open the skin of the earth, leaving scars that may never heal.\""},
      //{ position: isMobile ? [-1.5, -1, -0.6] : [2.3, 0, 3.6], rotation: [0, 0, 0], url: localImage('3.jpeg'), description: 'An abstract character emerging from cracked soil, with golden veins fading into black. ' },
    ]);
  }, [isMobile]); // Update images when isMobile changes

  return <App images={images} />;
};

createRoot(document.getElementById('root')).render(<Main />);
