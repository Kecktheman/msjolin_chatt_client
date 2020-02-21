<script>
  export let name;
  export let isYou;
</script>

<style>

</style>

<div class={isYou == true ? 'you' : ''}>{name}</div>
