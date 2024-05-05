package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.labactivity.flashcarddesign.databinding.FlashcardBackBinding

class FlashcardBack : AppCompatActivity() {
    private lateinit var binding:FlashcardBackBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = FlashcardBackBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val term =intent.getStringExtra("termData")
        val def =intent.getStringExtra("defData")

        binding.textViewTerm.text = term
        binding.textViewDefinition.text = def
    }
}