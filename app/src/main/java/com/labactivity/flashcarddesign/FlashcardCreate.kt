package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater

import com.labactivity.flashcarddesign.databinding.FlashcardCreateScreenBinding
import com.labactivity.flashcarddesign.databinding.FlashcardItemBinding

class FlashcardCreate : AppCompatActivity() {

    private lateinit var binding: FlashcardCreateScreenBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = FlashcardCreateScreenBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.doneBtn.setOnClickListener {
            passDataToNextActivity()
        }

        binding.addBtn.setOnClickListener {
            addFlashcard()
        }
    }

    private fun addFlashcard() {
        val flashcardBinding = FlashcardItemBinding.inflate(LayoutInflater.from(this), binding.container, false)
        binding.container.addView(flashcardBinding.root)
    }

    private fun passDataToNextActivity() {
        val terms = ArrayList<String>()
        val definitions = ArrayList<String>()
        val title = intent.getStringExtra("title")
        val description = intent.getStringExtra("description")

        for (i in 0 until binding.container.childCount) {
            val flashcardView = binding.container.getChildAt(i)
            val flashcardBinding = FlashcardItemBinding.bind(flashcardView)

            val term = flashcardBinding.editTextTerm.text.toString()
            val definition = flashcardBinding.editTextDefinition.text.toString()

            terms.add(term)
            definitions.add(definition)
        }

        val intent = Intent(this, FlashcardFront::class.java)
        intent.putStringArrayListExtra("termsData", terms)
        intent.putStringArrayListExtra("definitionsData", definitions)
        intent.putExtra("title", title)
        intent.putExtra("description", description)
        startActivity(intent)
    }
}