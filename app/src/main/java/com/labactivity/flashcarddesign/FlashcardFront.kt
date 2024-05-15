package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.labactivity.flashcarddesign.databinding.FlashcardFrontBinding

class FlashcardFront : AppCompatActivity() {
    private lateinit var binding:FlashcardFrontBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding =FlashcardFrontBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val term =intent.getStringExtra("termData")
        val def =intent.getStringExtra("defData")
        val title = intent.getStringExtra("titleData")
        val desc = intent.getStringExtra("descData")

        binding.textViewTerm.text = term
        binding.titleTxt.text = title

        binding.flipBtn.setOnClickListener(){
            val intent = Intent(this,FlashcardBack::class.java)
            intent.putExtra("termData",term)
            intent.putExtra("defData",def)
            startActivity(intent)
        }
    }
}