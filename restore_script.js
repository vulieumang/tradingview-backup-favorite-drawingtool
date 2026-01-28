/**
 * TradingView Favorites Restore Script
 * Chạy lệnh này trong Console, sau đó chọn file JSON backup từ máy tính của bạn.
 */
(function () {
    if (typeof TVSettings === 'undefined') {
        alert("Không tìm thấy đối tượng TVSettings. Hãy chắc chắn bạn đang ở trang Chart của TradingView.");
        return;
    }

    // Tạo một input file ẩn
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    fileInput.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            try {
                const dataToRestore = JSON.parse(event.target.result);

                Object.keys(dataToRestore).forEach(key => {
                    TVSettings.setValue(key, dataToRestore[key]);
                    console.log(`Đã khôi phục: ${key}`);
                });

                if (confirm("Khôi phục thành công! Bạn có muốn tải lại trang để áp dụng thay đổi ngay không?")) {
                    window.location.reload();
                }
            } catch (err) {
                alert("Lỗi: Không thể đọc file. Hãy chắc chắn bạn chọn đúng file JSON backup.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
})();
