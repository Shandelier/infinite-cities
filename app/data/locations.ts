export interface LocationPoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  name: string;
  beforeImage: { src: string; alt: string; label: string };
  afterImage: { src: string; alt: string; label: string };
}

const locations: LocationPoint[] = [
  {
    "name": "Buenos Aires, Argentina",
    "lat": -34.6037,
    "lng": -58.3816,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/buenosaires1.jpg",
      "alt": "Buenos Aires, Argentina today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/buenosaires2.png",
      "alt": "Buenos Aires, Argentina future",
      "label": "Future"
    }
  },
  {
    "name": "Istanbul, Turkey",
    "lat": 41.0082,
    "lng": 28.9784,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/istanbul1.jpeg",
      "alt": "Istanbul, Turkey today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/istanbul2.png",
      "alt": "Istanbul, Turkey future",
      "label": "Future"
    }
  },
  {
    "name": "Lisbon, Portugal",
    "lat": 38.7223,
    "lng": -9.1393,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/lisbon1.jpg",
      "alt": "Lisbon, Portugal today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/lisbon2.png",
      "alt": "Lisbon, Portugal future",
      "label": "Future"
    }
  },
  {
    "name": "Mexico City, Mexico",
    "lat": 19.4326,
    "lng": -99.1332,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/mexico1.jpeg",
      "alt": "Mexico City, Mexico today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/mexico2.png",
      "alt": "Mexico City, Mexico future",
      "label": "Future"
    }
  },
  {
    "name": "New Delhi, India",
    "lat": 28.6139,
    "lng": 77.209,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/newdelhi1.jpg",
      "alt": "New Delhi, India today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/newdelhi2.png",
      "alt": "New Delhi, India future",
      "label": "Future"
    }
  },
  {
    "name": "New York, USA",
    "lat": 40.7128,
    "lng": -74.006,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/newyork1.jpg",
      "alt": "New York, USA today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/newyork2.png",
      "alt": "New York, USA future",
      "label": "Future"
    }
  },
  {
    "name": "Paris, France",
    "lat": 48.8566,
    "lng": 2.3522,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/paris1.webp",
      "alt": "Paris, France today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/paris2.png",
      "alt": "Paris, France future",
      "label": "Future"
    }
  },
  {
    "name": "Saint Petersburg, Russia",
    "lat": 59.9311,
    "lng": 30.3609,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/saintpetersburg1.jpg",
      "alt": "Saint Petersburg, Russia today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/saintpetersburg2.png",
      "alt": "Saint Petersburg, Russia future",
      "label": "Future"
    }
  },
  {
    "name": "Seoul, South Korea",
    "lat": 37.5665,
    "lng": 126.978,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/seoul1.jpg",
      "alt": "Seoul, South Korea today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/seoul2.png",
      "alt": "Seoul, South Korea future",
      "label": "Future"
    }
  },
  {
    "name": "Shanghai, China",
    "lat": 31.2304,
    "lng": 121.4737,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/shanghai-rails1.jpg",
      "alt": "Shanghai, China today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/shanghai-rails2.png",
      "alt": "Shanghai, China future",
      "label": "Future"
    }
  },
  {
    "name": "Singapore, Singapore",
    "lat": 1.3521,
    "lng": 103.8198,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/singapore1.jpg",
      "alt": "Singapore, Singapore today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/singapore2.png",
      "alt": "Singapore, Singapore future",
      "label": "Future"
    }
  },
  {
    "name": "Sydney, Australia",
    "lat": -33.8688,
    "lng": 151.2093,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/sydney1.jpeg",
      "alt": "Sydney, Australia today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/sydney2.png",
      "alt": "Sydney, Australia future",
      "label": "Future"
    }
  },
  {
    "name": "Bellagio Fountain, USA",
    "lat": 36.1126,
    "lng": -115.1767,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/vegas-bellagio1.png",
      "alt": "Bellagio Fountain, USA today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/vegas-bellagio2.png",
      "alt": "Bellagio Fountain, USA future",
      "label": "Future"
    }
  },
  {
    "name": "Las Vegas, USA",
    "lat": 36.1699,
    "lng": -115.1398,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/vegas1.jpg",
      "alt": "Las Vegas, USA today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/vegas2.png",
      "alt": "Las Vegas, USA future",
      "label": "Future"
    }
  },
  {
    "name": "Warsaw, Poland",
    "lat": 52.2297,
    "lng": 21.0122,
    "size": 0.35,
    "color": "#ffa500",
    "beforeImage": {
      "src": "/images/urban/warsaw1.jpeg",
      "alt": "Warsaw, Poland today",
      "label": "Today"
    },
    "afterImage": {
      "src": "/images/urban/warsaw2.png",
      "alt": "Warsaw, Poland future",
      "label": "Future"
    }
  }
];

export default locations;
