<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
</script>

<style>
  b {
    display: block;
  }
  code {
    display: block;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }
</style>

<div id="70_483" transition:fly={{ x: -600, duration: 500 }}>
  <h2>Inför C# 70-483</h2>

  <section>
    <h3>Signature</h3>
  </section>

  <section>
    <h3>Delegates</h3>

    <ul>
      <li>A pointer to a method, with a particular signature.</li>
      <li>
        Delegates can point to a method from any class or struct (other files).
      </li>
      <li>Delegates can make a single method be treated like a class.</li>
      <li>A delegate can point to multiple methods.</li>
      <li>
        This code points to any method that matches it's signature. (void,
        string)
      </li>
    </ul>

    <h4>File program.cs</h4>

    <b>Declare delegate</b>
    <code>public delegate void DoMethod(string e);</code>

    <b>Bind delegate</b>
    <code>DoMethod DoIt = new DoMethod(c.DoThis);</code>

    <b>Subscribe local method to multiple methods in deligate</b>
    <code>
      // SUBSCRIBE SINGLE METHODS TO EVENT
      <br />
      DoIt -= c.DoThis; // UNSUBSCRIBE
      <br />
      DoIt += c.DoThis; // SUBSCRIBE
      <br />
      DoIt += c.DoThat;
      <br />
      DoIt("DOIT SINGLE");
    </code>

    <b>Ex. Assign local method to method in deligate</b>
    <code>
      DoMethod DoIt2;
      <br />
      DoIt2 = c.DoThis;
      <br />
      DoIt2("Called form DoIt2");
    </code>

    <b>Chain multiple local methods to trigger deligate method</b>
    <code>
      DoMethod DoIt3;
      <br />
      DoIt3 = DoIt + DoIt2;
      <br />
      DoIt3("DOIT3 MULTIP");
    </code>

    <h4>File Class1.cs</h4>
    <code>
      public void DoThis(string s)
      <br />
      Console.WriteLine("DoThis was called with string: " + s);
      <br />
      public void DoThat(string s)
      <br />
      Console.WriteLine("DoThat was called with string: " + s);
    </code>

  </section>

  <section>
    <h3>Compiler Directives</h3>

    <ul>
      <li>Called Preprocessor Directives</li>
      <li>
        Include and exclude portions of the program when compiling occurs.
        Different directives can be used in development, test, production etc.
      </li>
      <li>
        Can tag code to inform the compiler of certain behaviurs. #if, #define,
        #warning, #line
      </li>
    </ul>

    <div />

  </section>

</div>
