import { loadEnv } from "./load-env.js";
import { listVoices } from "./tts.js";

loadEnv();

const voices = await listVoices();
for (const v of voices) {
  const labels = v.labels ? Object.values(v.labels).join(", ") : "";
  console.log(`${v.voice_id}\t${v.name}\t${labels}`);
}
console.error(`\n${voices.length} voices. Set ELEVENLABS_VOICE_ID in .env to the id you want.`);
