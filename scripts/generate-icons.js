import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard Brand SVG (512x512)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9DCB"/>
      <stop offset="50%" stop-color="#FFAECE"/>
      <stop offset="100%" stop-color="#FFD1E8"/>
    </linearGradient>
    <linearGradient id="lavenderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C8B6FF"/>
      <stop offset="100%" stop-color="#B39DFF"/>
    </linearGradient>
    <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFF0F5"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#2D3142" flood-opacity="0.15"/>
    </filter>
    <filter id="cakeShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#2D3142" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Base Rounded Icon Container -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)" stroke="#FFFFFF" stroke-width="8" filter="url(#softShadow)"/>

  <!-- Subtle Decorative Polka/Sparkles -->
  <circle cx="90" cy="90" r="6" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="420" cy="90" r="8" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="70" cy="240" r="5" fill="#FFFFFF" opacity="0.5"/>
  <circle cx="440" cy="230" r="6" fill="#FFFFFF" opacity="0.5"/>
  <circle cx="110" cy="410" r="7" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="400" cy="415" r="7" fill="#FFFFFF" opacity="0.6"/>

  <!-- Cake Pedestal Stand -->
  <g filter="url(#cakeShadow)">
    <path d="M190 395 L322 395 L310 420 L350 426 C350 426 340 435 320 435 L192 435 C172 435 162 426 162 426 L202 420 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="256" cy="392" rx="160" ry="18" fill="#FFFFFF" stroke="#2D3142" stroke-width="6"/>
    <ellipse cx="256" cy="392" rx="146" ry="10" fill="#FFD1E8" opacity="0.7"/>

    <!-- Bottom Cake Tier -->
    <path d="M128 310 C128 310 128 382 128 382 C128 395 185 405 256 405 C327 405 384 395 384 382 L384 310 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="6"/>
    <!-- Bottom tier shadow/creme stripes -->
    <path d="M132 350 C165 365 210 372 256 372 C302 372 347 365 380 350 L382 378 C347 394 302 401 256 401 C210 401 165 394 130 378 Z" fill="#FFD1E8"/>
    
    <!-- Lavender ribbon band -->
    <path d="M130 368 C165 380 209 386 256 386 C303 386 347 380 382 368 L383 376 C347 388 303 394 256 394 C209 394 165 388 129 376 Z" fill="url(#lavenderGrad)" stroke="#2D3142" stroke-width="2"/>

    <!-- Frosting Scallops Tier 1 -->
    <path d="M128 310 
             C142 328, 160 328, 170 312 
             C182 328, 200 328, 212 312 
             C224 330, 246 330, 256 312 
             C266 330, 288 330, 300 312 
             C312 328, 330 328, 342 312 
             C354 328, 372 328, 384 310 
             C384 294, 327 282, 256 282 
             C185 282, 128 294, 128 310 Z" 
          fill="url(#creamGrad)" stroke="#2D3142" stroke-width="6" stroke-linejoin="round"/>

    <!-- Top Cake Tier -->
    <path d="M166 226 C166 226 166 284 166 284 C166 295 206 304 256 304 C306 304 346 295 346 284 L346 226 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="6"/>
    <!-- Top tier ribbon in lavender -->
    <path d="M167 266 C193 276 224 282 256 282 C288 282 319 276 345 266 L345 273 C319 283 288 289 256 289 C224 289 193 283 167 273 Z" fill="url(#lavenderGrad)" stroke="#2D3142" stroke-width="2"/>

    <!-- Top Frosting Scallops & Drips -->
    <path d="M166 226 
             C176 242, 192 242, 202 228 
             C212 246, 230 248, 240 228 
             C250 252, 268 250, 276 228 
             C286 245, 302 245, 312 228 
             C322 242, 336 242, 346 226 
             C346 212, 306 202, 256 202 
             C206 202, 166 212, 166 226 Z" 
          fill="url(#creamGrad)" stroke="#2D3142" stroke-width="6" stroke-linejoin="round"/>

    <!-- Strawberries & Cherries with glaze -->
    <g transform="translate(256, 196)">
      <!-- Central Strawberry/Heart Berry -->
      <path d="M0 -34 C-24 -56, -42 -22, -18 4 C-8 15, 0 24, 0 24 C0 24, 8 15, 18 4 C42 -22, 24 -56, 0 -34 Z" fill="#FF4D85" stroke="#2D3142" stroke-width="4.5"/>
      <!-- Berry Leaf / Mint -->
      <path d="M0 -34 C-10 -46, -20 -44, -18 -38 C-16 -32, -6 -32, 0 -34 Z" fill="#70D6B2" stroke="#2D3142" stroke-width="2"/>
      <path d="M0 -34 C10 -46, 20 -44, 18 -38 C16 -32, 6 -32, 0 -34 Z" fill="#70D6B2" stroke="#2D3142" stroke-width="2"/>
      <!-- Golden Sparkle Candle Flame on top -->
      <path d="M0 -42 C-4 -52, -5 -60, 0 -70 C5 -60, 4 -52, 0 -42 Z" fill="#FFC72C" stroke="#2D3142" stroke-width="2.5"/>
      <circle cx="0" cy="-56" r="3" fill="#FFF8D6"/>
    </g>

    <!-- Side Berries -->
    <circle cx="212" cy="208" r="14" fill="#C8B6FF" stroke="#2D3142" stroke-width="4"/>
    <circle cx="210" cy="205" r="4" fill="#FFFFFF"/>
    
    <circle cx="300" cy="208" r="14" fill="#FF9DCB" stroke="#2D3142" stroke-width="4"/>
    <circle cx="298" cy="205" r="4" fill="#FFFFFF"/>

    <!-- Decorative Piping Stars -->
    <g fill="#FFFFFF" stroke="#2D3142" stroke-width="2">
      <circle cx="185" cy="216" r="6"/>
      <circle cx="236" cy="218" r="6"/>
      <circle cx="276" cy="218" r="6"/>
      <circle cx="327" cy="216" r="6"/>
    </g>

    <!-- Floating Sparkles -->
    <path d="M142 165 Q142 178 132 178 Q142 178 142 191 Q142 178 152 178 Q142 178 142 165 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="2.5"/>
    <path d="M370 160 Q370 173 360 173 Q370 173 370 186 Q370 173 380 173 Q370 173 370 160 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="2.5"/>
  </g>

  <!-- Bakery Banner Badge at bottom -->
  <g filter="url(#softShadow)">
    <rect x="96" y="434" width="320" height="42" rx="21" fill="#FFFFFF" stroke="#2D3142" stroke-width="4.5"/>
    <text x="256" y="462" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="19" fill="#2D3142" letter-spacing="2">
      BOLOS MÁRCIA
    </text>
  </g>
</svg>`;

// 2. Maskable SVG (Full bleed with safe zone ~80% in center)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9DCB"/>
      <stop offset="50%" stop-color="#FFAECE"/>
      <stop offset="100%" stop-color="#FFD1E8"/>
    </linearGradient>
    <linearGradient id="lavenderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C8B6FF"/>
      <stop offset="100%" stop-color="#B39DFF"/>
    </linearGradient>
    <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFF0F5"/>
    </linearGradient>
    <filter id="cakeShadowM" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#2D3142" flood-opacity="0.16"/>
    </filter>
  </defs>

  <!-- Full bleed background for Android dynamic cropping (circle/squircle) -->
  <rect width="512" height="512" fill="url(#bgGradFull)"/>

  <!-- Subtle circles pattern inside -->
  <circle cx="80" cy="80" r="16" fill="#FFFFFF" opacity="0.25"/>
  <circle cx="432" cy="80" r="24" fill="#FFFFFF" opacity="0.25"/>
  <circle cx="70" cy="430" r="20" fill="#FFFFFF" opacity="0.25"/>
  <circle cx="440" cy="430" r="18" fill="#FFFFFF" opacity="0.25"/>

  <!-- Scaled content centered within safe zone (scale 0.78 around 256,256) -->
  <g transform="translate(256, 252) scale(0.78) translate(-256, -256)" filter="url(#cakeShadowM)">
    <!-- Cake Pedestal Stand -->
    <path d="M190 395 L322 395 L310 420 L350 426 C350 426 340 435 320 435 L192 435 C172 435 162 426 162 426 L202 420 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="256" cy="392" rx="160" ry="18" fill="#FFFFFF" stroke="#2D3142" stroke-width="6"/>
    <ellipse cx="256" cy="392" rx="146" ry="10" fill="#FFD1E8" opacity="0.7"/>

    <!-- Bottom Cake Tier -->
    <path d="M128 310 C128 310 128 382 128 382 C128 395 185 405 256 405 C327 405 384 395 384 382 L384 310 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="6"/>
    <path d="M132 350 C165 365 210 372 256 372 C302 372 347 365 380 350 L382 378 C347 394 302 401 256 401 C210 401 165 394 130 378 Z" fill="#FFD1E8"/>
    <path d="M130 368 C165 380 209 386 256 386 C303 386 347 380 382 368 L383 376 C347 388 303 394 256 394 C209 394 165 388 129 376 Z" fill="url(#lavenderGrad)" stroke="#2D3142" stroke-width="2"/>

    <!-- Frosting Scallops Tier 1 -->
    <path d="M128 310 
             C142 328, 160 328, 170 312 
             C182 328, 200 328, 212 312 
             C224 330, 246 330, 256 312 
             C266 330, 288 330, 300 312 
             C312 328, 330 328, 342 312 
             C354 328, 372 328, 384 310 
             C384 294, 327 282, 256 282 
             C185 282, 128 294, 128 310 Z" 
          fill="url(#creamGrad)" stroke="#2D3142" stroke-width="6" stroke-linejoin="round"/>

    <!-- Top Cake Tier -->
    <path d="M166 226 C166 226 166 284 166 284 C166 295 206 304 256 304 C306 304 346 295 346 284 L346 226 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="6"/>
    <path d="M167 266 C193 276 224 282 256 282 C288 282 319 276 345 266 L345 273 C319 283 288 289 256 289 C224 289 193 283 167 273 Z" fill="url(#lavenderGrad)" stroke="#2D3142" stroke-width="2"/>

    <!-- Top Frosting Scallops & Drips -->
    <path d="M166 226 
             C176 242, 192 242, 202 228 
             C212 246, 230 248, 240 228 
             C250 252, 268 250, 276 228 
             C286 245, 302 245, 312 228 
             C322 242, 336 242, 346 226 
             C346 212, 306 202, 256 202 
             C206 202, 166 212, 166 226 Z" 
          fill="url(#creamGrad)" stroke="#2D3142" stroke-width="6" stroke-linejoin="round"/>

    <!-- Strawberry / Heart Topper -->
    <g transform="translate(256, 196)">
      <path d="M0 -34 C-24 -56, -42 -22, -18 4 C-8 15, 0 24, 0 24 C0 24, 8 15, 18 4 C42 -22, 24 -56, 0 -34 Z" fill="#FF4D85" stroke="#2D3142" stroke-width="4.5"/>
      <path d="M0 -34 C-10 -46, -20 -44, -18 -38 C-16 -32, -6 -32, 0 -34 Z" fill="#70D6B2" stroke="#2D3142" stroke-width="2"/>
      <path d="M0 -34 C10 -46, 20 -44, 18 -38 C16 -32, 6 -32, 0 -34 Z" fill="#70D6B2" stroke="#2D3142" stroke-width="2"/>
      <path d="M0 -42 C-4 -52, -5 -60, 0 -70 C5 -60, 4 -52, 0 -42 Z" fill="#FFC72C" stroke="#2D3142" stroke-width="2.5"/>
      <circle cx="0" cy="-56" r="3" fill="#FFF8D6"/>
    </g>

    <!-- Side Berries -->
    <circle cx="212" cy="208" r="14" fill="#C8B6FF" stroke="#2D3142" stroke-width="4"/>
    <circle cx="210" cy="205" r="4" fill="#FFFFFF"/>
    <circle cx="300" cy="208" r="14" fill="#FF9DCB" stroke="#2D3142" stroke-width="4"/>
    <circle cx="298" cy="205" r="4" fill="#FFFFFF"/>

    <!-- Floating Sparkles -->
    <path d="M142 165 Q142 178 132 178 Q142 178 142 191 Q142 178 152 178 Q142 178 142 165 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="2.5"/>
    <path d="M370 160 Q370 173 360 173 Q370 173 370 186 Q370 173 380 173 Q370 173 370 160 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="2.5"/>

    <!-- Bakery Banner Badge -->
    <rect x="96" y="434" width="320" height="42" rx="21" fill="#FFFFFF" stroke="#2D3142" stroke-width="4.5"/>
    <text x="256" y="462" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="19" fill="#2D3142" letter-spacing="2">
      BOLOS MÁRCIA
    </text>
  </g>
</svg>`;

async function main() {
  console.log('Generating PWA icons...');

  // Save icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg);

  // Generate pwa-512x512.png
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // Generate pwa-192x192.png
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // Generate pwa-maskable-512x512.png
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Generate favicon.png and favicon.ico
  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  await sharp(Buffer.from(standardSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico & favicon.png');

  console.log('All icons generated successfully!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
