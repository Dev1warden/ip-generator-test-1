function generateRandomIP() {
  // Generate four random numbers between 0 and 255
  const octets = [];
  for (let i = 0; i < 4; i++) {
    octets.push(Math.floor(Math.random() * 256));
  }
  return octets.join('.');
}

function isValidIP(ip) {
  const octets = ip.trim().split('.');
  if (octets.length !== 4) return false;
  return octets.every(octet => {
    const n = Number(octet);
    return /^\d+$/.test(octet) && n >= 0 && n <= 255;
  });
}

function mutateIP(ip) {
  // Mutate one random octet in the IP to a new random value
  const octets = ip.trim().split('.').map(Number);
  const index = Math.floor(Math.random() * 4);
  let newOctet;
  do {
    newOctet = Math.floor(Math.random() * 256);
  } while (newOctet === octets[index]);
  octets[index] = newOctet;
  return octets.join('.');
}

function showIP(ip, color=null) {
  const ipDisplay = document.getElementById('ip-address');
  ipDisplay.textContent = ip;
  if (color) {
    ipDisplay.style.color = color;
  } else {
    ipDisplay.style.color = ""; // Default color (removes previous inline color)
  }
  ipDisplay.style.transition = "color 0.3s ease-in-out";
}

function incrementCounter() {
  let count = Number(sessionStorage.getItem('ipCounter') || 0) + 1;
  sessionStorage.setItem('ipCounter', count);
  document.getElementById('counter-number').textContent = count;
}

function resetCounter() {
  sessionStorage.setItem('ipCounter', 0);
  document.getElementById('counter-number').textContent = 0;
}

window.onload = function () {
  document.getElementById('counter-number').textContent = sessionStorage.getItem('ipCounter') || 0;
};

document.getElementById('generate-btn').addEventListener('click', () => {
  const ipAddress = generateRandomIP();
  showIP(ipAddress, null); // Default color for generated IP
  document.getElementById('ip-input').value = "";
  incrementCounter();
});

document.getElementById('mutate-btn').addEventListener('click', () => {
  const input = document.getElementById('ip-input').value;
  if (!isValidIP(input)) {
    showIP("Invalid IP address!", "#fc3a3a");
    return;
  }
  showIP(mutateIP(input), "#00ffcc");
  incrementCounter();
});

document.getElementById('ip-input').addEventListener('input', (e) => {
  const val = e.target.value;
  if (val === "") {
    showIP('Click "Generate" or enter your own IP', "#aaa");
  } else if (isValidIP(val)) {
    showIP(val, "#00ffcc");
  } else {
    showIP("Invalid IP address!", "#fc3a3a");
  }
});

document.getElementById('copy-btn').addEventListener('click', () => {
  const ip = document.getElementById('ip-address').textContent;
  if(!isValidIP(ip)) return;
  navigator.clipboard.writeText(ip);
  showIP("Copied!", "#ff8c00");
  setTimeout(() => {
    showIP(ip, null);
  }, 900);
});

document.getElementById('share-btn').addEventListener('click', async () => {
  const ip = document.getElementById('ip-address').textContent;
  if(!isValidIP(ip)) return;
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Generated IP',
        text: `Check out this IP address: ${ip}`,
        url: window.location.href
      });
    } catch (err) {}
  } else {
    // Fallback: copy link with IP as URL param
    const url = `${window.location.origin}${window.location.pathname}?ip=${encodeURIComponent(ip)}`;
    navigator.clipboard.writeText(url);
    showIP("Link copied!", "#ff8c00");
    setTimeout(() => {
      showIP(ip, null);
    }, 900);
  }
});

// Allow sharing via URL param (?ip=...)
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.has('ip') && isValidIP(params.get('ip'))) {
    showIP(params.get('ip'), "#00ffcc");
    document.getElementById('ip-input').value = params.get('ip');
  }
})();
