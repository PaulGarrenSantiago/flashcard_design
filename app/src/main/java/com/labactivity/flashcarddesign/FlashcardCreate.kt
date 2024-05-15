package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

import com.labactivity.flashcarddesign.databinding.FlashcardCreateScreenBinding

class FlashcardCreate : AppCompatActivity() {
    private lateinit var binding:FlashcardCreateScreenBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = FlashcardCreateScreenBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.doneBtn.setOnClickListener(){
            val termInput = binding.editTextTerm.text.toString()
            val termInput1 = binding.editTextTerm1.text.toString()
            val defInput = binding.editTextDefinition.text.toString()
            val defInput1 = binding.editTextDefinition2.text.toString()
            val titleInput =intent.getStringExtra("titleData")
            val descriptionInput =intent.getStringExtra("descData")

            val intent = Intent(this, FlashcardFront::class.java)
            intent.putExtra("termData",termInput)
            intent.putExtra("defData",defInput)
            intent.putExtra("termData1",termInput1)
            intent.putExtra("defData1",defInput1)
            intent.putExtra("titleData",titleInput)
            intent.putExtra("descData", descriptionInput)

            startActivity(intent)
        }
    }
}