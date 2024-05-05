package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.labactivity.flashcarddesign.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding:ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.doneBtn.setOnClickListener(){
            val termInput = binding.editTextTerm.text.toString()
            val termInput1 = binding.editTextTerm1.text.toString()
            val defInput = binding.editTextDefinition.text.toString()
            val defInput1 = binding.editTextDefinition2.text.toString()

            val intent = Intent(this, FlashcardFront::class.java)
            intent.putExtra("termData",termInput)
            intent.putExtra("defData",defInput)
            intent.putExtra("termData1",termInput1)
            intent.putExtra("defData1",defInput1)

            startActivity(intent)
        }
    }
}