// api/chat.js — Vercel Serverless Function
// OpenAI API 키는 환경변수(OPENAI_API_KEY)에만 저장됨
// 응답자 브라우저에 키가 노출되지 않음

let visitorCount = 0;

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const { messages, sessionId } = req.body;

    // 첫 대화 시작 시점(system 프롬프트만 있거나 sessionId가 없을 때) 새로운 순번 부여
    let simId = sessionId;
    const isNewSession = !simId && (!messages || messages.length <= 1);

    if (isNewSession) {
      visitorCount += 1;
      simId = `SIM-${String(visitorCount).padStart(3, '0')}`;
      console.log(`[${new Date().toISOString()}] [NEW_SESSION] 참여자 순번 부여: ${simId}`);
    } else {
      if (!simId) {
        visitorCount += 1;
        simId = `SIM-${String(visitorCount).padStart(3, '0')}`;
      }
      const lastUserMsg = Array.isArray(messages)
        ? [...messages].reverse().find((m) => m.role === 'user')?.content || ''
        : '';
      console.log(`[${new Date().toISOString()}] [${simId}] 대화 진행 | 응답: ${lastUserMsg.slice(0, 100)}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 500,
        temperature: 0.65,
        messages: messages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error(`[${new Date().toISOString()}] [${simId}] OpenAI API 오류:`, err.error?.message);
      throw new Error(err.error?.message || 'OpenAI API 오류');
    }

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || '';
    console.log(`[${new Date().toISOString()}] [${simId}] 챗봇 응답 완료: ${botReply.slice(0, 100)}`);

    // 기존 프론트엔드 구조(data.choices[0].message.content)를 그대로 유지하면서 simId 추가 반환
    return res.status(200).json({
      ...data,
      simId
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] 서버 에러:`, error.message);
    return res.status(500).json({ error: error.message });
  }
}
