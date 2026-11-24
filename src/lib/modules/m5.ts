import type { Module } from "@/lib/course";

export const m5: Module = {
  id: "m5",
  title: "Open Models & Fine-tuning",
  outcome: "Run models locally and know exactly when fine-tuning is worth it.",
  project: "Fine-tuned Hinglish customer-support model",
  lessons: [
    {
      slug: "local-models",
      title: "Running Llama & Qwen locally with Ollama",
      minutes: 12,
      summary: "Free, private inference on your laptop.",
      blocks: [
        { type: "code", lang: "bash", code: "curl -fsSL https://ollama.com/install.sh | sh\nollama run llama3.2:3b" },
        {
          type: "diagram",
          id: "ollama",
          caption: "Same SDK pattern — point base_url at localhost:11434.",
        },
        {
          type: "p",
          text: "Ollama exposes an OpenAI-compatible API on localhost:11434, so your existing code works by changing one base_url. Perfect for hackathons with no API budget.",
        },
      ],
      quiz: {
        question: "Why is an OpenAI-compatible local endpoint useful?",
        options: [
          "It is faster than GPUs",
          "You can switch between hosted and local models without rewriting code",
          "It removes the need for prompts",
          "It trains the model",
        ],
        answer: 1,
        explanation: "Same SDK, different base_url — easy provider switching.",
      },
      task: "Point your Module 1 CLI at a local model and compare quality vs. GPT-4o-mini.",
    },
    {
      slug: "when-to-finetune",
      title: "Prompting vs RAG vs fine-tuning",
      minutes: 10,
      summary: "The decision framework senior engineers use.",
      blocks: [
        {
          type: "diagram",
          id: "when-to-finetune",
          caption: "Prompt first, RAG for knowledge, fine-tune last.",
        },
        {
          type: "list",
          items: [
            "Need new knowledge? → RAG.",
            "Need a consistent style, format or tone? → Fine-tune.",
            "Neither? → Better prompts first. Always.",
          ],
        },
      ],
      quiz: {
        question: "Your bot must answer from 2,000 company policy docs that change monthly. Best approach?",
        options: ["Fine-tune every month", "RAG", "Bigger temperature", "Train from scratch"],
        answer: 1,
        explanation: "Changing knowledge belongs in retrieval, not in weights.",
      },
      task: "Write a one-page decision doc for a real use case of your choice.",
    },
    {
      slug: "lora-finetuning",
      title: "LoRA fine-tuning on a free Colab GPU",
      minutes: 25,
      summary: "Fine-tune a small model on 500 examples in under an hour.",
      blocks: [
        {
          type: "diagram",
          id: "lora",
          caption: "Freeze the base model; train small LoRA adapters only.",
        },
        {
          type: "code",
          lang: "python",
          code: 'from peft import LoraConfig\nfrom trl import SFTTrainer\n\npeft_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])\ntrainer = SFTTrainer(model=model, train_dataset=ds, peft_config=peft_config)\ntrainer.train()',
        },
        {
          type: "p",
          text: "LoRA trains small adapter matrices instead of all weights, so a 3B model fits on a free T4 GPU.",
        },
      ],
      quiz: {
        question: "Why does LoRA make fine-tuning cheap?",
        options: [
          "It skips training",
          "It trains small adapter weights instead of the full model",
          "It uses CPUs only",
          "It deletes layers",
        ],
        answer: 1,
        explanation: "Only low-rank adapter matrices are updated, cutting memory and compute.",
      },
      task: "Fine-tune on 500 Hinglish support conversations and publish to Hugging Face.",
    },
  ],
};
