const _0x3a4b = "gVH30eaBb4DV1utfJ94m0GVymawfG5QlCySazIA";
const KEY = _0x3a4b.split('').reverse().join('');
const MODEL = "gemini-2.5-flash-lite";

window.h = async (prompt) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [{parts: [{text: `Viết code Python giải quyết bài toán sau. Yêu cầu: sử dụng import sys; input = sys.stdin.readline để đọc dữ liệu. Chỉ trả về code thuần, không giải thích. Bài toán: ${prompt}`}]}]
        })
    });
    const data = await res.json();
    const code = data.candidates[0].content.parts[0].text.replace(/```python\n?|```/g, '');
    console.log(code);
    copy(code);
};
