// gemini-solver.js - Nhập đề trực tiếp, không đọc web
const _0x3a4b = "gVH30eaBb4DV1utfJ94m0GVymawfG5QlCySazIA";
const KEY = _0x3a4b.split('').reverse().join('');
const MODEL = "gemini-2.5-flash-lite";

window.solve = () => {
    console.log('📝 Dán đề bài vào và nhấn Enter:');
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Dán đề bài vào đây...';
    textarea.style.position = 'fixed';
    textarea.style.top = '50%';
    textarea.style.left = '50%';
    textarea.style.transform = 'translate(-50%, -50%)';
    textarea.style.width = '80%';
    textarea.style.height = '60%';
    textarea.style.zIndex = '9999';
    textarea.style.padding = '10px';
    textarea.style.fontSize = '14px';
    textarea.style.fontFamily = 'monospace';
    
    const btn = document.createElement('button');
    btn.textContent = 'Gửi đề';
    btn.style.position = 'fixed';
    btn.style.bottom = '20%';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '16px';
    btn.style.cursor = 'pointer';
    
    document.body.appendChild(textarea);
    document.body.appendChild(btn);
    
    btn.onclick = async () => {
        const problem = textarea.value;
        if (!problem.trim()) {
            alert('Vui lòng nhập đề bài!');
            return;
        }
        
        document.body.removeChild(textarea);
        document.body.removeChild(btn);
        
        console.log('🤖 Đang giải...');
        
        const prompt = `Viết code Python giải bài toán sau. Yêu cầu:
1. Sử dụng import sys; input = sys.stdin.readline để đọc dữ liệu
2. Code phải tối ưu cho ràng buộc lớn (N,K ≤ 10^9)
3. Chỉ trả về code Python thuần, không giải thích

ĐỀ BÀI:
${problem}`;

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{parts: [{text: prompt}]}],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
                })
            });
            
            const data = await res.json();
            let code = data.candidates[0].content.parts[0].text;
            code = code.replace(/```python\n?/g, '').replace(/```/g, '').trim();
            
            console.log('\n' + '='.repeat(70));
            console.log('💻 CODE GIẢI:');
            console.log('='.repeat(70));
            console.log(code);
            console.log('='.repeat(70));
            
            await navigator.clipboard.writeText(code);
            console.log('✅ Đã copy code vào clipboard!');
            
        } catch (error) {
            console.error('❌ Lỗi:', error.message);
        }
    };
};

window.solveQuick = (problem) => {
    if (!problem) {
        console.log('❌ Cách dùng: solveQuick(`đề bài của bạn`)');
        return;
    }
    
    console.log('🤖 Đang giải...');
    
    const prompt = `Viết code Python giải bài toán sau. Yêu cầu:
1. Sử dụng import sys; input = sys.stdin.readline
2. Code tối ưu cho ràng buộc lớn (N,K ≤ 10^9)
3. Chỉ trả về code thuần, không giải thích

ĐỀ BÀI:
${problem}`;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}],
            generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
        })
    })
    .then(res => res.json())
    .then(data => {
        let code = data.candidates[0].content.parts[0].text;
        code = code.replace(/```python\n?/g, '').replace(/```/g, '').trim();
        
        console.log('\n' + '='.repeat(70));
        console.log('💻 CODE GIẢI:');
        console.log('='.repeat(70));
        console.log(code);
        console.log('='.repeat(70));
        
        navigator.clipboard.writeText(code);
        console.log('✅ Đã copy code vào clipboard!');
    })
    .catch(error => console.error('❌ Lỗi:', error.message));
};

console.log('✅ Gemini Solver ready!');
console.log('📌 Cách dùng:');
console.log('   solve()              - Mở cửa sổ để dán đề');
console.log('   solveQuick(`đề bài`) - Giải nhanh với đề 1 dòng');
