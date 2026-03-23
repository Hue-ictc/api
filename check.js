// auto-solver.js - Tự động đọc web và giải đề
const _0x3a4b = "gVH30eaBb4DV1utfJ94m0GVymawfG5QlCySazIA";
const KEY = _0x3a4b.split('').reverse().join('');
const MODEL = "gemini-2.5-flash-lite";

// Hàm lấy nội dung chính của trang
function getPageContent() {
    // Ưu tiên các thẻ thường chứa nội dung chính
    const selectors = [
        'article', 'main', '.content', '.post-content', 
        '.problem-statement', '.description', '.question',
        '[role="main"]', '#content', '.entry-content'
    ];
    
    let content = '';
    
    // Thử tìm theo selector ưu tiên
    for (let selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText.trim().length > 100) {
            content = element.innerText;
            break;
        }
    }
    
    // Nếu chưa có, lấy toàn bộ body
    if (!content || content.length < 100) {
        content = document.body.innerText;
    }
    
    // Lọc bỏ nội dung không cần thiết
    content = content
        .replace(/\s+/g, ' ')          // Giảm khoảng trắng
        .replace(/ADVERTISEMENT/gi, '')
        .replace(/Menu|Home|About|Contact/gi, '')
        .trim();
    
    return content;
}

// Hàm phát hiện ngôn ngữ đề bài (có thể mở rộng)
function detectProblemType(content) {
    if (content.includes('input') && content.includes('output')) return 'io';
    if (content.includes('test case')) return 'test';
    if (content.includes('sample')) return 'sample';
    return 'general';
}

// Hàm chính: đọc web và giải
window.solve = async () => {
    console.log('🔍 Đang đọc nội dung trang web...');
    
    const content = getPageContent();
    
    if (!content || content.length < 20) {
        console.log('❌ Không tìm thấy nội dung đề bài!');
        return;
    }
    
    console.log(`📄 Đã đọc ${content.length} ký tự`);
    console.log('🤖 Đang gửi đến AI...');
    
    const prompt = `Bạn là chuyên gia giải đề tin học. Dưới đây là nội dung đề bài từ một trang web. Hãy:
1. Phân tích yêu cầu
2. Viết code Python giải quyết bài toán
3. Code phải sử dụng: import sys; input = sys.stdin.readline
4. Chỉ trả về code Python thuần, không giải thích

ĐỀ BÀI:
${content.substring(0, 4000)}`; // Giới hạn 4000 ký tự tránh quá dài

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contents: [{parts: [{text: prompt}]}],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2000
                }
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
        
        // Copy code
        try {
            await navigator.clipboard.writeText(code);
            console.log('✅ Đã copy code vào clipboard!');
        } catch (err) {
            console.log('⚠️ Copy thủ công bằng Ctrl+C');
        }
        
        return code;
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }
};

// Hàm giải với đề tùy chỉnh
window.solveWith = async (customPrompt) => {
    if (!customPrompt) {
        console.log('❌ Vui lòng nhập đề bài: solveWith("đề bài của bạn")');
        return;
    }
    
    const prompt = `Viết code Python giải quyết bài toán sau. Yêu cầu: sử dụng import sys; input = sys.stdin.readline để đọc dữ liệu. Chỉ trả về code thuần, không giải thích. Bài toán: ${customPrompt}`;
    
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
        console.log('✅ Đã copy code!');
        
        return code;
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }
};

// Hàm xem nội dung đã đọc
window.showContent = () => {
    const content = getPageContent();
    console.log('📄 NỘI DUNG TRANG:');
    console.log('='.repeat(70));
    console.log(content.substring(0, 2000));
    console.log('='.repeat(70));
    console.log(`Tổng: ${content.length} ký tự`);
};

// Thông báo sẵn sàng
console.log('✅ Auto Solver ready!');
console.log('📌 Các lệnh:');
console.log('   solve()       - Tự đọc web và giải đề');
console.log('   solveWith("đề bài") - Giải đề tùy chỉnh');
console.log('   showContent() - Xem nội dung web đã đọc');
