package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.FlashcardFrontBinding

class FlashcardFront : AppCompatActivity() {
    private lateinit var binding: FlashcardFrontBinding
    private var currentIndex = 0
    private lateinit var terms: ArrayList<String>
    private lateinit var definitions: ArrayList<String>
    private var isFront = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = FlashcardFrontBinding.inflate(layoutInflater)
        setContentView(binding.root)

        terms = intent.getStringArrayListExtra("termsData") ?: arrayListOf()
        definitions = intent.getStringArrayListExtra("definitionsData") ?: arrayListOf()
        val title = intent.getStringExtra("title")
        var description = intent.getStringExtra("description")

        binding.titleTxt.text = title

        binding.textViewDefinition.visibility = View.INVISIBLE

        updateFlashcard(currentIndex)

        binding.flipBtn.setOnClickListener {
            flipCard()
        }
        binding.nextBtn.setOnClickListener {
            currentIndex = (currentIndex + 1) % terms.size
            updateFlashcard(currentIndex)
        }
        binding.backBtn.setOnClickListener {
            currentIndex = (currentIndex - 1 + terms.size) % terms.size
            updateFlashcard(currentIndex)
        }
    }

    private fun flipCard() {
        if (isFront) {
            binding.textViewDefinition.visibility = View.VISIBLE
            binding.textViewTerm.visibility = View.INVISIBLE
            isFront = false
        } else {
            binding.textViewDefinition.visibility = View.INVISIBLE
            binding.textViewTerm.visibility = View.VISIBLE
            isFront = true
        }
    }

    private fun updateFlashcard(index: Int) {
        binding.textViewTerm.text = terms[index]
        binding.textViewDefinition.text = definitions[index]
        binding.textViewTerm.visibility = View.VISIBLE
        binding.textViewDefinition.visibility = View.INVISIBLE
        isFront = true

        val pageNumber = index + 1
        binding.textViewCardNum.text = pageNumber.toString()
    }
}