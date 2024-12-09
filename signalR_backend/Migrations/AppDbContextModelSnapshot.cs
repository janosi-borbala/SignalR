﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using signalR_backend.Data;

#nullable disable

namespace signalR_backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("signalR_backend.Models.Option", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("PollId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("PollId");

                    b.ToTable("Options");
                });

            modelBuilder.Entity("signalR_backend.Models.OptionUser", b =>
                {
                    b.Property<Guid>("OptionId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("VotedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("OptionId", "UserId");

                    b.HasIndex("UserId");

                    b.HasIndex("OptionId", "UserId")
                        .IsUnique();

                    b.ToTable("OptionUsers");
                });

            modelBuilder.Entity("signalR_backend.Models.Poll", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("CreatedBy")
                        .HasColumnType("TEXT");

                    b.Property<string>("Key")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("Key")
                        .IsUnique();

                    b.ToTable("Polls");
                });

            modelBuilder.Entity("signalR_backend.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("signalR_backend.Models.Option", b =>
                {
                    b.HasOne("signalR_backend.Models.Poll", "Poll")
                        .WithMany("Options")
                        .HasForeignKey("PollId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Poll");
                });

            modelBuilder.Entity("signalR_backend.Models.OptionUser", b =>
                {
                    b.HasOne("signalR_backend.Models.Option", "Option")
                        .WithMany("OptionUsers")
                        .HasForeignKey("OptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("signalR_backend.Models.User", "User")
                        .WithMany("OptionUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Option");

                    b.Navigation("User");
                });

            modelBuilder.Entity("signalR_backend.Models.Option", b =>
                {
                    b.Navigation("OptionUsers");
                });

            modelBuilder.Entity("signalR_backend.Models.Poll", b =>
                {
                    b.Navigation("Options");
                });

            modelBuilder.Entity("signalR_backend.Models.User", b =>
                {
                    b.Navigation("OptionUsers");
                });
#pragma warning restore 612, 618
        }
    }
}
