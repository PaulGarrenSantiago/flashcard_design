package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.labactivity.flashcarddesign.databinding.TermsBinding

class Terms : AppCompatActivity() {
    private lateinit var binding: TermsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = TermsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.NextBtn.setOnClickListener {
            val titleInput = binding.titleTxt.text.toString()
            val descriptionInput = binding.DescriptionTxt.text.toString()
            val intent = Intent(this, FlashcardCreate::class.java)
            intent.putExtra("title",titleInput)
            intent.putExtra("description", descriptionInput)
            startActivity(intent)
        }
    }
}
