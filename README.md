# OpenWardrobe

AI-powered fashion design generator. Create stunning fashion designs with just a few clicks.

## 🚀 Features

- **Visual Design Selection**: Choose from trends, color schemes, moods, and seasons
- **AI Image Generation**: Powered by ImagineAPI (Midjourney)
- **Image Variations**: Change colors, patterns, and moods of existing designs
- **Real-time Progress**: Live updates during image generation
- **Favorites & History**: Save and manage your designs
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Integration**: ImagineAPI Cloud
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/kaim1005kaim/openwardrobe.git
cd openwardrobe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your ImagineAPI credentials:
```env
IMAGINE_API_URL=https://cl.imagineapi.dev
IMAGINE_API_TOKEN=your_api_token_here
IMAGINE_API_MODEL=MJ
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Usage

1. **Select Design Options**: Choose from various trends, color schemes, moods, and seasons
2. **Generate Images**: Click the generate button to create AI-powered fashion designs
3. **Create Variations**: Modify existing designs by changing colors, patterns, or moods
4. **Save Favorites**: Mark designs you love for easy access later
5. **View History**: Browse through all your created designs

## 🔧 Configuration

### Generation Settings

- **Creativity Level**: Conservative, Balanced, Experimental, Maximum
- **Quality**: Standard, High, Ultra
- **Batch Size**: Generate 1-4 images at once

### API Integration

The app uses ImagineAPI Cloud for image generation. Key features:
- Automatic retry on failures
- Progress tracking
- Webhook support for real-time updates
- Mock mode for development

## 🚢 Deployment

### Netlify (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Initialize and deploy:
```bash
netlify init
netlify env:set IMAGINE_API_URL https://cl.imagineapi.dev
netlify env:set IMAGINE_API_TOKEN your_api_token_here
netlify env:set IMAGINE_API_MODEL MJ
netlify deploy --build --prod
```

### Manual Build

```bash
npm run build
npm run start
```

## 🔍 API Endpoints

- `GET /api/webhook` - Webhook verification
- `POST /api/webhook` - Receive image generation updates

## 🧪 Development

### Mock Mode

The app includes mock implementations for development without API keys:
- Simulated image generation with random placeholder images
- Progress tracking simulation
- All UI functionality works without real API calls

### Testing Webhook

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": {"id": "test-123", "status": "completed", "url": "https://example.com/image.jpg"}}'
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `IMAGINE_API_URL` | ImagineAPI base URL | Yes |
| `IMAGINE_API_TOKEN` | Your ImagineAPI token | Yes |
| `IMAGINE_API_MODEL` | Model to use (MJ, DALLE, etc.) | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- ImagineAPI documentation: [https://imagineapi.dev/docs](https://imagineapi.dev/docs)

## 🔮 Roadmap

- [ ] Advanced editing tools (crop, resize, filters)
- [ ] Style transfer between images
- [ ] Community sharing features
- [ ] Multi-language support
- [ ] Integration with fashion databases
- [ ] Custom model training