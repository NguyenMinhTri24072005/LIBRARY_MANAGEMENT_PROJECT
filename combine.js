const fs = require('fs');
const path = require('path');

const outputFile = 'project_combined.txt';
// Các đuôi file muốn gộp
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.scss', '.md', '.env']; 
// Thêm 'uploads', 'assets' vào ignore nếu không muốn in cây thư mục ảnh
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'uploads', 'assets', 'public'];

function shouldInclude(file) {
    return extensions.includes(path.extname(file)) || file === '.env';
}

// 1. Hàm đệ quy để vẽ cây thư mục (bỏ qua các file/folder không cần thiết)
function generateTree(dir, prefix = '') {
    let treeStr = '';
    
    // Đọc và lọc các thư mục/file hợp lệ
    const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter(entry => {
            if (ignoreDirs.includes(entry.name)) return false; // Bỏ qua folder trong blacklist
            if (entry.isFile() && !shouldInclude(entry.name) && entry.name !== 'combine.js') return false; // Bỏ qua file không đúng đuôi
            return true;
        });

    entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        
        treeStr += `${prefix}${pointer}${entry.name}\n`;
        
        if (entry.isDirectory()) {
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');
            treeStr += generateTree(path.join(dir, entry.name), nextPrefix);
        }
    });
    
    return treeStr;
}

// 2. Hàm đệ quy để gộp nội dung file
function combine(dir, outStream) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (ignoreDirs.includes(entry.name)) continue;
        
        if (entry.isDirectory()) {
            combine(fullPath, outStream);
        } else if (shouldInclude(entry.name) && entry.name !== 'combine.js' && entry.name !== outputFile) {
            outStream.write(`\n\n=======================================================\n`);
            outStream.write(`FILE: ${fullPath}\n`);
            outStream.write(`=======================================================\n\n`);
            const content = fs.readFileSync(fullPath, 'utf-8');
            outStream.write(content);
        }
    }
}

// 3. Thực thi và ghi ra file
const out = fs.createWriteStream(outputFile);

// Ghi Cây cấu trúc dự án lên đầu file
out.write("=======================================================\n");
out.write("CÂY CẤU TRÚC DỰ ÁN\n");
out.write("=======================================================\n\n");
out.write(path.basename(path.resolve('.')) + '\n'); // In tên thư mục gốc
out.write(generateTree('.'));

// Ghi Nội dung chi tiết ở bên dưới
out.write("\n\n=======================================================\n");
out.write("NỘI DUNG CHI TIẾT CÁC FILE\n");
out.write("=======================================================\n");

combine('.', out);

out.end(() => {
    console.log(`\n✅ Thành công! Toàn bộ Cây thư mục và Nội dung code đã được gộp vào file: ${outputFile}\n`);
});