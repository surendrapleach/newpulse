// Consolidated & Simplified Mock Data
// Sources all articles from a single flat array

export const PROFILE_USER = {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9876543210",
    role: "Heritage Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    stats: { saved: 23, read: 12 }
};

export const INITIAL_CHAT_MESSAGES = [
    { id: '1', role: 'model', text: 'Namaste! I am your Heritage Guide. Ask me anything about Indian traditions, festivals, or history.' }
];

export const EXPLORE_CATEGORIES = [
    { name: 'Heritage', key: 'heritage', icon: '🏛️', image: 'https://image.slidesharecdn.com/heritage-180505070314/75/Heritage-1-2048.jpg' },
    { name: 'Dance', key: 'dance', icon: '💃', image: 'https://www.drishtiias.com/images/uploads/1576219602_images.jpg' },
    { name: 'History', key: 'history', icon: '📜', image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=400&auto=format&fit=crop' },
    { name: 'Events', key: 'events', icon: '🎭', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLrU2L-pXYQzJJU9p2VdWbxpBqGSVRIcFh7A&s' },
    { name: 'Culture', key: 'culture', icon: '🕉️', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400&auto=format&fit=crop' },
    { name: 'Food', key: 'food', icon: '🥘', image: 'https://static.toiimg.com/thumb/msid-123295982,imgsize-42748,width-400,height-225,resizemode-72/123295982.jpg' },
    { name: 'Art', key: 'art', icon: '🎨', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop' },
];

export const NOTIFICATIONS = [
    {
        id: "n1",
        title: "Padma Shri Awards 2026",
        location: "National",
        source: "PIB India",
        timeAgo: "10m ago",
        image: require('../../assets/images/news/padma shri awards 2026.png'),
    },
    {
        id: "n2",
        title: "UNESCO Nomination for Root Bridges",
        location: "Meghalaya",
        source: "Heritage Pulse",
        timeAgo: "2h ago",
        image: require("../../assets/images/heritage/India Nominates Meghalaya's Living Root Bridges for UNESCO.png"),
    },
];

/**
 * Neat and Simple Articles Format
 * Fields: title, category, trending(bool), latest(bool), sourceLink, image, headline, content, views, likes
 */5
export const ARTICLES = [
    {
        id: "nt1",
        title: "Heritage Fest celebrates Indian culture",
        category: "Events",
        isTrending: true,
        isLatest: false,
        sourceLink: "https://telanganatoday.com/heritage-fest-celebrates-indian-culture-at-hare-krishna-golden-temple",
        image: "https://image.telanganatoday.com/wp-content/uploads/2025/12/02-5_V_jpg--816x480-4g.webp?sw=1536&dsz=816x480&iw=615&p=false&r=1.25",
        headline: "Annual Heritage Fest Celebrates Indian Arts",
        content: `The Hare Krishna Movement in Hyderabad recently organized its grand Annual Heritage & Cultural celebrations, known as the Heritage Fest, at the iconic Golden Temple in Banjara Hills. This flagship initiative, led by the cultural wing SUMEDHASA, saw enthusiastic participation from students and educators across the region. The festival serves as a vital platform for young minds to explore India’s timeless spiritual and ethical traditions through various creative arts.`,
        views: "2.1k",
        likes: "450"
    },
    {
        id: "nt2",
        title: "Traditions and Celebrations",
        category: "Events",
        isTrending: false,
        isLatest: true,
        sourceLink: "https://www.justdial.com/list/journey-through-traditions-and-celebrations-exploring-the-cultural-events-in-india?wkwebview=1",
        image: "https://content.jdmagicbox.com/quickquotes/listicle/listicle_1686140315148_74ycs_1040x500.jpg?impolicy=queryparam&im=Resize=(1200,900),aspect=fit&q=75&width=1200",
        headline: "Discovering India's Vibrant Cultural Events",
        content: "India is globally renowned for its incredibly rich cultural heritage and diversity, which is beautifully reflected in its wide array of festive events. These celebrations serve as captivating showcases of the nation's ancient traditions, classical art forms, and spiritual practices. From the exuberant nationwide festivities of Diwali and Holi to intricate classical dance performances, these events blend age-old customs with contemporary expressions to create a unique cultural mosaic.",
        views: "1.8k",
        likes: "320"
    },
    {
        id: "nt3",
        title: "Padma Shri Awards 2026",
        category: "News",
        isTrending: true,
        isLatest: true,
        sourceLink: "https://www.linkedin.com/feed/update/urn:li:activity:7293796342898311168/",
        image: require('../../assets/images/news/padma shri awards 2026.png'),
        headline: "Padma Shri Awards 2026 Honor Local Heroes",
        content: "The Government of India has officially announced the Padma Shri Awards for 2026, recognizing individuals for their exceptional contributions to the nation's culture. Notable awardees include Buddha Rashmi Mani, celebrated for his pioneering archaeological research, and Narayan Vyas, honored for his tireless work in heritage conservation. Both figures have played critical roles in documenting and preserving India's ancient history, ensuring that the legacy of our ancestors remains alive for future generations.",
        views: "3.5k",
        likes: "890",
        region: "National"
    },
    {
        id: "l2",
        title: "India Nominates Meghalaya's Living Root Bridges for UNESCO",
        category: "Heritage",
        isTrending: true,
        isLatest: false,
        sourceLink: "https://lnkd.in/dEwvwmHJ",
        image: require("../../assets/images/heritage/India Nominates Meghalaya's Living Root Bridges for UNESCO.png"),
        headline: "Root Bridges Nominated for UNESCO Status",
        content: "India has formally submitted the nomination dossier for Meghalaya’s iconic living root bridges to UNESCO for the upcoming 2026–27 World Heritage List cycle. These remarkable structures, located in the Khasi and Jaintia Hills, represent a unique harmony between nature and indigenous engineering. By seeking this global recognition, the government aims to highlight the importance of preserving traditional knowledge systems and the sustainable cultural landscapes of the North Eastern tribal communities.",
        views: "4.2k",
        likes: "1.5k",
        region: "National"
    },
    {
        id: "h1",
        title: "𝗛𝗲𝗿𝗶𝘁𝗮𝗴𝗲 𝗮𝗻𝗱 𝗣𝗼𝘄𝗲𝗿",
        category: "Heritage",
        isTrending: false,
        isLatest: true,
        sourceLink: "https://lnkd.in/ghjB-DA7",
        image: "https://media.licdn.com/dms/image/v2/D5622AQHBUO3rdac1eg/feedshare-shrink_800/B56Zpe7txQG4Ak-/0/1762529304885?e=1772668800&v=beta&t=dbZSF_tFba5IlOvY2_qFkxZ5FdzV6TZ0QqdRRTLwOmQ",
        headline: "Deccan Heritage Session Highlights Power",
        content: "During a recent session on Deccan heritage, Ms. Sakeena provided a captivating look at the intertwined narratives of gender and authority in regional history. By examining historical records and architectural sites, the presentation illustrated how women’s influence was deeply woven into the socio-political fabric of the Deccan sultanates. This refreshing perspective encourages us to view heritage not merely as a record of kings, but as a complex reflection of diverse voices and legacies.",
        views: "2.8k",
        likes: "610",
        region: "National"
    },
    {
        id: "d1",
        title: "Graceful Rhythms of Indian Classical Dance",
        category: "Dance",
        isTrending: true,
        isLatest: true,
        publisher: "Livemint",
        sourceLink: "https://www.livemint.com/web-stories/things-to-keep-in-mind-while-travelling-to-south-india-11670035944016.html",
        image: require('../../assets/images/dance/Graceful Rhythms of Indian Classical Dance.jpg'),
        headline: "Graceful Rhythms of Classic Indian Dance",
        content: "This article explores the mesmerizing essence of Indian classical dance, focusing on the vibrant costumes and intricate movements of performers. Adorned in ornate jewelry and silk attire, dancers bring ancient stories to life through expressive mudras and rhythmic footwork. Specifically highlighting the elegance of Odissi, the narrative explains how these performances are deeply tied to temple traditions and architectural motifs, representing a spiritual journey expressed through physical grace.",
        views: "1.2k",
        likes: "450",
        region: "National"
    },
    {
        id: "d2",
        title: "Kathakali Splendor: A Glimpse of Indian Heritage",
        category: "Dance",
        isTrending: true,
        isLatest: false,
        publisher: "travelandleisureasia",
        sourceLink: "https://www.travelandleisureasia.com/in/destinations/india/where-to-experience-kochi-culture/",
        image: require('../../assets/images/dance/Kathakali Splendor A Glimpse of Indian Heritage.jpg'),
        headline: "Explore the Majestic Splendor of Kathakali",
        content: "Kathakali is a world-famous dance-drama from Kerala, known for its dramatic makeup and elaborate costumes that transform performers into mythological figures. This traditional art form combines music, vocal performance, and highly stylized hand gestures to narrate epic tales from the Puranas. The visual grandeur of the towering headgear and vibrant colors serves as a tribute to South India's ceremonial artistry, making every performance a profound experience that connects the audience with the divine.",
        views: "1.5k",
        likes: "520",
        region: "National"
    },
    {
        id: "c1",
        title: "Kerala’s Cultural Canvas: Dance, Nature, and Tradition",
        category: "Culture",
        isTrending: false,
        isLatest: true,
        publisher: "wikipedia",
        sourceLink: "https://en.wikipedia.org/wiki/Culture_of_Kerala",
        image: require('../../assets/images/culture/Kerala’s Cultural Canvas Dance, Nature, and Tradition.gif'),
        headline: "Kerala’s Canvas: Nature and Folk Heritage",
        content: "Kerala’s culture is a beautiful tapestry woven from classical arts, lush landscapes, and maritime history. From the stylized movements of Mohiniyattam to the peaceful sight of houseboats on the backwaters, the region embodies a deep connection to rhythm and ritual. This visual and narrative tribute celebrates the state's agrarian roots and its maritime legacy, showcasing how traditional lifestyles and ceremonial arts coexist within the natural beauty of palm-fringed channels and verdant fields.",
        views: "3.2k",
        likes: "890",
        region: "National"
    },
    {
        id: "c2",
        title: "Indian Culture",
        category: "Culture",
        isTrending: true,
        isLatest: true,
        publisher: "indianetzone",
        sourceLink: "https://indianetzone.wordpress.com/2020/04/02/indian-culture/",
        image: "https://indianetzone.wordpress.com/wp-content/uploads/2020/04/indian-art-culture.-940x800-1.jpg",
        headline: "Philosophy and Spirit of Indian Culture",
        content: "Indian culture seeks a profound harmony by reconciling the spiritual realm with the material world, preserving scientific truths while keeping the spirit as its keystone. This unique heritage is celebrated globally for its incredible diversity, manifested in philosophical beliefs, intricate architecture, and fine arts. Whether expressed through ancient temple carvings or modern spiritual practices, the traditions of India continue to evolve, offering a fascinating glimpse into a civilization that values both inner peace and outward excellence.",
        views: "2.4k",
        likes: "560",
        region: "National"
    },
    {
        id: "hi1",
        title: "History of India",
        category: "History",
        isTrending: false,
        isLatest: true,
        publisher: "wikipedia",
        sourceLink: "https://en.wikipedia.org/wiki/History_of_India",
        image: require('../../assets/images/history/cradle_of_civilization.jpg'),
        headline: "History of India: From Ancient Arrivals",
        content: "The history of India spans tens of thousands of years, beginning with the arrival of anatomically modern humans on the subcontinent. From the early settlements in the Neolithic period to the rise of the sophisticated Indus Valley Civilisation, the region has been a cradle of global culture. This article delves into the technological and social advancements of the Harappan people, whose urban planning and maritime trade networks set the foundation for the complex social structures that would define South Asia for millennia.",
        views: "5.1k",
        likes: "1.2k",
        region: "National"
    },
    {
        id: "hi2",
        title: "India’s Journey of Heritage Preservation",
        category: "History",
        isTrending: true,
        isLatest: false,
        publisher: "pib.gov",
        sourceLink: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2122423&reg=3&lang=2#:~:text=India%20has%2043%20sites%20on%20the%20World,to%20help%20develop%20facilities%20at%20protected%20monuments.",
        image: "https://static.pib.gov.in/WriteReadData/userfiles/image/image003UUR3.png",
        headline: "Preserving India's Rich Heritage Journey",
        content: "Heritage preservation in India is an ongoing journey that goes far beyond stones and ruins. It lives in the whispers of temple walls and the folk songs passed down through generations. World Heritage Day serves as a vital reminder to protect these treasures from disasters and conflicts. By focusing on preparedness and learning from decades of international action, we can ensure that the stories of who we were and what we stood for continue to inspire future generations and safeguard our collective cultural identity.",
        views: "1.8k",
        likes: "420",
        region: "National"
    },
    {
        id: "f1",
        title: "Flavors of Odisha Cuisine",
        category: "Food",
        isTrending: false,
        isLatest: true,
        publisher: "indianculture",
        sourceLink: "https://www.indianculture.gov.in/cuisine/odisha#",
        image: require('../../assets/images/food/odisha-food.png'),
        headline: "Soulful Flavors of Odisha's Food Scenes",
        content: "Odisha’s cuisine is a soulful reflection of temple traditions, emphasizing simple ingredients and comforting textures. Centered around rice and seasonal vegetables, dishes like Dalma and Pakhala Bhata offer a unique balance of nutrition and flavor. The state is also famous for its fresh cheese sweets, such as the charred Chhena Poda and the syrupy Rasgulla. Every bite tells a story of the region’s agrarian history and its spiritual devotion, making Odia food a must-experience for anyone exploring the diverse tastes of India.",
        views: "2.7k",
        likes: "610",
        region: "National"
    },
    {
        id: "a1",
        title: "Madhubani Art: A Timeless Tradition",
        category: "Art",
        isTrending: true,
        isLatest: true,
        publisher: "Pleach India",
        sourceLink: "https://en.wikipedia.org/wiki/Madhubani_art",
        image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&auto=format&fit=crop",
        headline: "Madhubani Art: Vibrant Mithila Traditions",
        content: "Madhubani painting, also known as Mithila art, is a traditional style practiced in the Mithila region of India and Nepal. Characterized by its eye-catching geometrical patterns and vibrant colors, this art form traditionally used natural dyes and pigments. The themes often revolve around nature, mythology, and social events. Today, Madhubani art has transitioned to canvas and paper, representing a timeless legacy of indigenous storytelling and creative folk expression.",
        views: "3.9k",
        likes: "1.1k",
        region: "Pleach India"
    },
    {
        id: "a2",
        title: "Yogini and Myna in Deccani Miniature Art",
        category: "Art",
        isTrending: true,
        isLatest: false,
        publisher: "Pleach India",
        sourceLink: "https://pleachindia.org/deccani-miniature-art/a-yogini-with-parrot/",
        image: require('../../assets/images/art/Yogini and Myna in Deccani Miniature Art.png'),
        headline: "Yogini and Myna: Deccani Miniature Splendor",
        content: "The screen displays a cultural artwork titled A Yogini with Myna from the Bijapur School of Deccani miniature painting. The yogini, dressed in traditional attire, holds a myna bird while standing in a serene garden setting. The painting, dated to the 16th–17th century, is rendered in watercolor on paper and preserved by the Telangana State Museum. It perfectly encapsulates the elegance and spiritual grace of the Deccan’s artistic legacy.",
        views: "2.1k",
        likes: "480",
        region: "Pleach India"
    },
];

let savedArticleIds = ["nt1", "nt2", "l2"];

const truncate = (text, limit) => {
    if (!text || text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
};

const mapArticle = (a) => ({
    ...a,
    headline: truncate(a.headline || a.title, 60),
    content: truncate(a.content, 300),
    image: (typeof a.image === 'string' && a.image) ? { uri: a.image } : a.image, // Handle remote/local images
    publisher: a.publisher || (a.id === "l2" ? "Deccan Chronicle" : a.id === "l3" ? "New Indian Express" : "Heritage Pulse"),
    timestamp: a.timestamp || "Just now",
    badge: a.badge || a.category || "Heritage",
    tags: a.tags || ["Heritage", "Culture"], // Default tags
    rating: a.rating || "4.8",
    reviews: a.reviews || "120",
    location: a.location || "India",
    time: a.time || "5 min read",
});

export const MockDataService = {
    getTrendingArticles: (lang) => ARTICLES.filter(a => a.isTrending).map(mapArticle),
    getLatestNews: (lang) => ARTICLES.filter(a => a.isLatest).map(mapArticle),
    getAllArticles: (lang) => ARTICLES.map(mapArticle),
    getExploreSection: (key, lang) => {
        let items = [];
        if (key === 'topNews') items = ARTICLES.filter(a => a.isLatest);
        else if (key === 'culturalEvents') items = ARTICLES.filter(a => a.isTrending);
        else if (key === 'museums') items = ARTICLES.filter(a => ['museums', 'art'].includes(a.category.toLowerCase()));
        else items = ARTICLES.filter(a => a.category.toLowerCase() === key.toLowerCase());
        return items.map(mapArticle);
    },
    getArticleById: (id) => mapArticle(ARTICLES.find(a => a.id === id) || ARTICLES[0]),
    toggleBookmark: (id) => {
        if (savedArticleIds.includes(id)) {
            savedArticleIds = savedArticleIds.filter(sid => sid !== id);
            return false;
        }
        savedArticleIds.push(id);
        return true;
    },
    isBookmarked: (id) => savedArticleIds.includes(id),
    getSavedArticles: () => savedArticleIds.map(id => ARTICLES.find(a => a.id === id)).filter(Boolean).map(mapArticle),
    getUserProfile: () => PROFILE_USER,
    updateUserProfile: (updatedData) => {
        Object.assign(PROFILE_USER, updatedData);
        return true;
    },
    getExploreCategories: () => EXPLORE_CATEGORIES,
    refreshData: () => true, // Mock refresh
};
