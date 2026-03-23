// gemini-solver.js - Phiên bản gọn nhẹ
const _0x3a4b = "gVH30eaBb4DV1utfJ94m0GVymawfG5QlCySazIA";
const KEY = _0x3a4b.split('').reverse().join('');
const MODEL = "gemini-2.5-flash-lite";

window.solve = () => {
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Dán đề bài vào đây...';
    textarea.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:60%;z-index:9999;padding:10px;font:14px monospace';
    
    const btn = document.createElement('button');
    btn.textContent = 'Giải';
    btn.style.cssText = 'position:fixed;bottom:20%;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 20px;cursor:pointer';
    
    document.body.append(textarea, btn);
    
    btn.onclick = async () => {
        const problem = textarea.value.trim();
        if (!problem) return alert('Nhập đề!');
        document.body.removeChild(textarea);
        document.body.removeChild(btn);
        
        console.log('🤖 Đang giải...');
        
        const prompt = `Giải bài toán sau bằng Python. Yêu cầu:
- Dùng: import sys; input = sys.stdin.readline
- Code tối ưu, ngắn gọn
- Chỉ trả code, không giải thích

Đề: ${problem}`;

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{parts: [{text: prompt}]}],
                    generationConfig: {temperature: 0.2, maxOutputTokens: 1000}
                })
            });
            
            const data = await res.json();
            let code = data.candidates[0].content.parts[0].text;
            code = code.replace(/```python\n?/g, '').replace(/```/g, '').trim();
            
            console.log('\n' + '='.repeat(50));
            console.log(code);
            console.log('='.repeat(50));
            
            // Fix lỗi copy
            const copyCode = async () => {
                try {
                    await navigator.clipboard.writeText(code);
                    console.log('✅ Đã copy!');
                } catch(e) {
                    console.log('Copy thủ công: Ctrl+C');
                }
            };
            copyCode();
            
        } catch(err) {
            console.error('❌ Lỗi:', err.message);
        }
    };
};

window.solveQuick = (p) => {
    if (!p) return console.log('Dùng: solveQuick(`đề`)');
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [{parts: [{text: `Viết code Python giải: ${p}. Dùng sys.stdin.readline. Code ngắn gọn, chỉ code.`}]}],
            generationConfig: {temperature: 0.2, maxOutputTokens: 800}
        })
    })
    .then(r => r.json())
    .then(d => {
        let c = d.candidates[0].content.parts[0].text.replace(/```python\n?|```/g, '').trim();
        console.log('\n' + '='.repeat(50));
        console.log(c);
        console.log('='.repeat(50));
        navigator.clipboard.writeText(c);
        console.log('✅ Copied!');
    })
    .catch(e => console.log('❌', e.message));
};

console.log('✅ Ready! Dùng: solve() hoặc solveQuick(`đề`)');
