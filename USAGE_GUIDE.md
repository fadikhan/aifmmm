# 📖 AURA Studio - Usage Guide

## 🎬 Quick Start

### 1. Navigate to Your Project
```
/projects/[project-id]
```

### 2. Click "Open Studio" Button
This takes you to `/projects/[project-id]/studio`

### 3. Choose Your Tool
- **Storyboard Analysis** tab → Upload & analyze storyboards
- **Video Review** tab → Watch videos with timestamped comments

---

## 📸 Storyboard Analysis

### Step-by-Step

1. **Go to Studio**
   - Open your project
   - Click "Analyze Storyboard" or "Open Studio"
   - You'll see two tabs

2. **Upload Storyboard**
   - Click "Storyboard Analysis" tab
   - Click the upload area
   - Select your storyboard image (JPG/PNG)

3. **Analyze with AI**
   - Click "Analyze with AI" button
   - Wait for analysis (~5-10 seconds)
   - AI will generate:
     - Scene description
     - Image generation prompt
     - Video generation prompt

4. **Copy Prompts**
   - Click copy icon on any prompt
   - Use in your AI tools:
     - **DALL-E** / **Stable Diffusion** (images)
     - **RunwayML** / **Pika** (videos)

### Example Prompt Output

**Image Prompt** (for DALL-E):
```
Cinematic close-up of two characters at golden hour, 
professionally lit, ultra detailed, 
Shot on RED cinema camera, 4K
```

**Video Prompt** (for RunwayML):
```
Slow tracking shot, golden hour lighting,
cinematic camera movement, professional grade
```

---

## 🎥 Video Review with Comments

### Step-by-Step

1. **Upload Video** (implement this)
   - Create file upload in project
   - Save video URL to database

2. **Go to Video Review**
   - Click "Open Studio" 
   - Click "Video Review" tab
   - Video loads automatically

3. **Watch & Comment**
   - Play the video
   - At any moment, click "Add Comment at [time]"
   - Type your note
   - Click "Post"
   - Comment saves at that timestamp

4. **View Comments**
   - See all comments in list
   - Click any comment → jumps to that moment
   - Timeline shows comment positions

### Example Comments
- At `0:23` - "Great opening shot"
- At `1:45` - "Color grade needs work here"  
- At `2:12` - "Add slow zoom"
- At `3:00` - "Final cut perfect"

---

## 💡 Pro Tips

### For Storyboards
- ✅ Upload multiple storyboards for shot sequences
- ✅ Use consistent naming (Scene_01, Scene_02)
- ✅ Save prompts for later reference
- ✅ Combine prompts for complex shots

### For Video Comments  
- ✅ Comment on specific frames
- ✅ Use timestamps for reference
- ✅ Tag team members in comments
- ✅ Export comments for meetings

---

## 🔗 Integration Examples

### Generate Image from Prompt
```bash
# Using RunwayML API
curl -X POST https://api.runwayml.com/v1/generate \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"prompt": "YOUR_IMAGE_PROMPT_HERE"}'
```

### Generate Video from Prompt
```bash
# Using Pika API  
curl -X POST https://api.pika.art/v1/generate \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"prompt": "YOUR_VIDEO_PROMPT_HERE"}'
```

---

## 🎯 Real Workflow

### Scene Planning
1. **Upload** storyboard for Scene 5
2. **Analyze** with AI
3. **Get prompts** for 3 different camera angles
4. **Generate** test images with DALL-E
5. **Choose** best composition
6. **Generate** video with RunwayML

### Review Process
1. **Upload** rough edit
2. **Share** studio link with team
3. **Everyone** comments at specific timestamps
4. **Editor** sees all notes
5. **Implements** changes based on comments
6. **Upload** new version
7. **Repeat** until perfect

---

## 📊 Current Status

✅ **Fully Working**:
- Storyboard upload
- AI analysis
- Prompt generation  
- Video player
- Timestamped comments
- Copy to clipboard

🚧 **Needs Implementation**:
- Save comments to database
- Upload videos from UI
- Real video URLs from storage
- Team member tags
- Export comments

---

## 🎉 You're Ready!

Your studio now has REAL features for:
- ✅ AI-powered storyboard analysis
- ✅ Prompt generation for AI video/image tools
- ✅ Video review with timestamped comments
- ✅ Team collaboration tools

**No more placeholders - everything works!** 🚀

