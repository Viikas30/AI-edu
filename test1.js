// your_script_name.js
import { YoutubeTranscript } from 'youtube-transcript';

// Try a different video ID that is known to have transcripts
const videoId = 'KXU75KQ9IbM'; // Example: A TED Talk

YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' }) // Request English transcript
  .then(transcript => {
    if (transcript.length > 0) {
      console.log(`Transcript found for video ID: ${videoId}`);
      // You can also loop through and print just the text:
      transcript.forEach(item => console.log(item.text));
    } else {
      console.log(`No English transcript found for video ID: ${videoId}`);
      console.log("It's possible the video has no captions, or captions in a different language.");
    }
  })
  .catch(error => {
    console.error(`Error fetching transcript for video ID: ${videoId}:`, error);
  });