document.querySelector('.view-btn').addEventListener("click", ()=>{
    document.querySelector('.dialog-container').classList.remove('hidden');
    document.querySelector('.details-container').classList.remove('hidden');
    document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
})

function toggleSection(header) {
            const section = header.parentElement;
            section.classList.toggle('expanded');
        }

        function closeDialog() {
            if (confirm('Are you sure you want to close?')) {
                document.querySelector('.dialog-container').classList.add('hidden');
                document.querySelector('.details-container').classList.add('hidden');
                document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
            }
        }

        function printDialog() {
            window.print();
        }

        function downloadData() {
            alert('Download functionality would be implemented here.');
        }