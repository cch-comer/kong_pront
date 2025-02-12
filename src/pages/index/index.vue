<script>
// 이전 페이지에 따라서 alert을 띄우든 말든
if (localStorage.getItem('username') === null || localStorage.getItem('username') === '') {
  window.location.href = '/login'
} else {
  window.location.href = '/overview'
}
</script>