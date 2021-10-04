<script>
  export let name;
  export let isYou;
</script>

<style>

</style>

<span class={isYou == true ? 'you' : ''}>{name}</span>
